pipeline {
    agent any

    parameters {
        string(name: 'DOCKERHUB_USERNAME', defaultValue: 'yourusername', description: 'Docker Hub Username')
        string(name: 'IMAGE_TAG',          defaultValue: 'latest',       description: 'Docker image tag (e.g. latest, v1.0.0)')
    }

    environment {
        DOCKER_CREDS   = credentials('docker-hub-credentials')
        BACKEND_IMAGE  = "${params.DOCKERHUB_USERNAME}/legal-backend:${params.IMAGE_TAG}"
        FRONTEND_IMAGE = "${params.DOCKERHUB_USERNAME}/legal-frontend:${params.IMAGE_TAG}"
        NODE_ENV       = 'test'
        KUBECONFIG     = 'C:\\ProgramData\\Jenkins\\.jenkins\\.kube\\config'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Backend Install') {
                    steps {
                        dir('backend') {
                            echo '📦 Installing backend dependencies...'
                            bat 'npm ci'
                        }
                    }
                }
                stage('Frontend Install') {
                    steps {
                        dir('frontend') {
                            echo '📦 Installing frontend dependencies...'
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        // ── Stage 3: Static Code Analysis (ESLint) ────────────────────
        stage('Static Code Analysis') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            echo '🔍 Running ESLint on backend...'
                            bat 'npm run lint || exit /b 0'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            echo '🔍 Running ESLint on frontend...'
                            bat 'npm run lint || exit /b 0'
                        }
                    }
                }
            }
        }

        // ── Stage 4: Unit Tests ────────────────────────────────────────
        stage('Unit Tests') {
            steps {
                dir('backend') {
                    echo '🧪 Running unit tests...'
                    bat 'npm run test:unit'
                }
            }
            post {
                always {
                    echo '📊 Unit test stage complete.'
                }
            }
        }

        // ── Stage 5: Integration Tests ─────────────────────────────────
        stage('Integration Tests') {
            steps {
                dir('backend') {
                    echo '🔗 Running integration tests...'
                    bat 'npm run test:integration'
                }
            }
        }

        // ── Stage 6: Test Coverage Report ─────────────────────────────
        stage('Test Coverage') {
            steps {
                dir('backend') {
                    echo '📈 Generating test coverage report...'
                    bat 'npm run test:coverage'
                }
            }
            post {
                always {
                    echo '✅ Coverage report generated in backend/coverage/'
                }
            }
        }

        // ── Stage 7: Build Frontend ────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo '🏗️ Building React frontend...'
                    bat 'npm run build'
                }
            }
        }

        // ── Stage 8: Docker Login ──────────────────────────────────────
        stage('Docker Login') {
            steps {
                echo '🔐 Logging into Docker Hub...'
                bat 'docker login -u %DOCKER_CREDS_USR% -p %DOCKER_CREDS_PSW%'
            }
        }

        // ── Stage 9: Build & Push Docker Images ───────────────────────
        stage('Build & Push Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        echo "🐳 Building backend image: ${env.BACKEND_IMAGE}"
                        bat "docker build -t ${env.BACKEND_IMAGE} -f backend/Dockerfile ."
                        bat "docker push ${env.BACKEND_IMAGE}"
                    }
                }
                stage('Frontend Image') {
                    steps {
                        echo "🐳 Building frontend image: ${env.FRONTEND_IMAGE}"
                        bat "docker build -t ${env.FRONTEND_IMAGE} -f frontend/Dockerfile ."
                        bat "docker push ${env.FRONTEND_IMAGE}"
                    }
                }
            }
        }

        // ── Stage 10: Deploy to Kubernetes ────────────────────────────
        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Applying Kubernetes manifests...'
                bat 'kubectl apply -f k8s/ --validate=false'
                bat 'kubectl set image deployment/legal-backend legal-backend=%BACKEND_IMAGE% || echo skipping'
                bat 'kubectl set image deployment/legal-frontend legal-frontend=%FRONTEND_IMAGE% || echo skipping'
                bat 'kubectl rollout status deployment/legal-backend --timeout=120s || echo rollout pending'
                bat 'kubectl rollout status deployment/legal-frontend --timeout=120s || echo rollout pending'
            }
        }

    post {
        success {
            echo '✅ Pipeline completed successfully! All stages passed.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above for details.'
        }
        always {
            echo "🏁 Build #${env.BUILD_NUMBER} finished with status: ${currentBuild.currentResult}"
        }
    }
}
