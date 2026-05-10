# ⚖️ LegalAdvisor Pro

A full-stack legal advisory platform with **AI-powered RAG-based legal suggestions**, role-based authentication (User / Lawyer), appointment booking system, and a complete DevOps pipeline (Docker, Kubernetes, Jenkins CI/CD, Ansible).

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Run Locally (Without Docker)](#4-run-locally-without-docker)
5. [Run with Docker Compose](#5-run-with-docker-compose)
6. [Run with Kubernetes (Minikube)](#6-run-with-kubernetes-minikube)
7. [CI/CD Pipeline (Jenkins)](#7-cicd-pipeline-jenkins)
8. [Ansible Configuration](#8-ansible-configuration)
9. [Static Code Analysis (ESLint)](#9-static-code-analysis-eslint)
10. [Unit Testing](#10-unit-testing)
11. [Integration Testing](#11-integration-testing)
12. [Test Coverage Report](#12-test-coverage-report)
13. [API Reference](#13-api-reference)
14. [Environment Variables](#14-environment-variables)

---

## 1. Project Overview

### Features
| Feature | Description |
|---|---|
| 🔐 Auth | Register/Login for Users and Lawyers with JWT + role-based access |
| 🤖 AI Suggestion | RAG-based legal situation analysis with Indian law references (IPC, CrPC, HMA, POSH, etc.) |
| 📅 Appointments | Users book lawyers; lawyers accept/reject with a quote price and date |
| ⚖️ Legal KB | Comprehensive knowledge base covering Criminal, Family, Civil, Cyber, Employment law |
| 🐳 Docker | Multi-stage Dockerfiles + Docker Compose for full stack |
| ☸️ Kubernetes | K8s manifests with health checks, resource limits, PVC, ConfigMaps, Secrets |
| 🔄 Jenkins | Full CI/CD: lint → unit test → integration test → coverage → build → push → deploy |
| 🧪 Testing | Jest unit + integration tests with MongoDB in-memory server |
| 📊 ESLint | Static code analysis for both backend and frontend |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB 7 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Testing | Jest, Supertest, mongodb-memory-server |
| Lint | ESLint |
| CI/CD | Jenkins |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes (Minikube for local) |
| Config Mgmt | Ansible |

---

## 3. Project Structure

```
devops-project/
├── backend/
│   ├── data/
│   │   └── legalKnowledge.js       ← RAG knowledge base (Indian law)
│   ├── models/
│   │   ├── User.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   └── suggestions.js          ← AI suggestion endpoint
│   ├── tests/
│   │   ├── unit/
│   │   │   └── legalKnowledge.test.js
│   │   └── integration/
│   │       └── api.test.js
│   ├── server.js
│   ├── package.json
│   ├── .eslintrc.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx   ← includes Suggestion tab
│   │   │   └── LawyerDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── k8s/
│   ├── mongo-deploy.yaml
│   ├── backend-deploy.yaml         ← ConfigMap + Secret + Deployment + Service
│   └── frontend-deploy.yaml
├── ansible/
│   ├── inventory
│   └── main.yml
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## 4. Run Locally (Without Docker)

### Prerequisites
- Node.js v18+ ([nodejs.org](https://nodejs.org))
- MongoDB running locally (or [MongoDB Atlas](https://cloud.mongodb.com))

### Step 1 – Clone / Extract the project

```bash
cd devops-project
```

### Step 2 – Set up Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env if needed (Mongo URI, JWT secret)
# Default: mongodb://localhost:27017/devops_legal

# Install dependencies
npm install

# Start backend (runs on port 5000)
npm start
```

> For development with auto-reload: `npm run dev` (requires nodemon)

### Step 3 – Set up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend dev server (runs on port 3000)
npm run dev
```

### Step 4 – Open the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 5. Run with Docker Compose

### Prerequisites
- Docker Desktop ([docker.com](https://docker.com))

### Step 1 – Build and Start All Services

```bash
# From the project root (devops-project/)
docker-compose up --build
```

This starts three containers:
- `legal_mongo` on port 27017
- `legal_backend` on port 5000
- `legal_frontend` on port 80

### Step 2 – Open the App

- Frontend: http://localhost:80
- Backend API: http://localhost:5000/health

### Step 3 – Stop All Services

```bash
docker-compose down

# To also remove volumes (wipes database):
docker-compose down -v
```

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend

# Rebuild only one service
docker-compose up --build backend

# Check running containers
docker ps
```

---

## 6. Run with Kubernetes (Minikube)

### Prerequisites
- Minikube ([minikube.sigs.k8s.io](https://minikube.sigs.k8s.io))
- kubectl ([kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/))
- Docker Hub account

### Step 1 – Update Image Names

Open `k8s/backend-deploy.yaml` and `k8s/frontend-deploy.yaml`.
Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```yaml
image: yourusername/legal-backend:latest
```

### Step 2 – Build and Push Docker Images

```bash
# Login to Docker Hub
docker login

# Build and push backend
docker build -t yourusername/legal-backend:latest -f backend/Dockerfile .
docker push yourusername/legal-backend:latest

# Build and push frontend
docker build -t yourusername/legal-frontend:latest -f frontend/Dockerfile .
docker push yourusername/legal-frontend:latest
```

### Step 3 – Start Minikube

```bash
minikube start --driver=docker
```

### Step 4 – Apply All Kubernetes Manifests

```bash
# Apply in order: mongo first, then backend, then frontend
kubectl apply -f k8s/mongo-deploy.yaml
kubectl apply -f k8s/backend-deploy.yaml
kubectl apply -f k8s/frontend-deploy.yaml

# Or apply everything at once
kubectl apply -f k8s/
```

### Step 5 – Verify Pods are Running

```bash
# Check all pods
kubectl get pods

# Expected output:
# NAME                              READY   STATUS    RESTARTS
# legal-backend-xxx-yyy             1/1     Running   0
# legal-frontend-xxx-yyy            1/1     Running   0
# mongo-xxx-yyy                     1/1     Running   0

# Check services
kubectl get services

# Check logs if a pod is failing
kubectl logs <pod-name>
```

### Step 6 – Access the Application

```bash
# Get Minikube IP
minikube ip

# OR use minikube service tunnel
minikube service frontend-service
minikube service backend-service
```

### Step 7 – Tear Down

```bash
kubectl delete -f k8s/
minikube stop
```

---

## 7. CI/CD Pipeline (Jenkins)

### Prerequisites
- Jenkins LTS ([jenkins.io](https://www.jenkins.io))
- Docker installed on the Jenkins agent
- kubectl configured on the Jenkins agent (for deploy stage)
- Node.js plugin installed in Jenkins

### Step 1 – Install Jenkins Plugins

In Jenkins → Manage Jenkins → Plugins, install:
- Pipeline
- Git
- NodeJS Plugin
- Docker Pipeline

### Step 2 – Create Docker Hub Credentials

1. Jenkins → Manage Jenkins → Credentials → System → Global Credentials
2. Click **Add Credentials**
3. Kind: **Username with password**
4. Username: your Docker Hub username
5. Password: your Docker Hub password or access token
6. ID: `docker-hub-credentials` ← **must match exactly**

### Step 3 – Create a New Pipeline Job

1. Jenkins → New Item → **Pipeline** → OK
2. Under **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: your Git repo URL
   - Branch: `*/main` or `*/master`
   - Script Path: `Jenkinsfile`
3. Save

### Step 4 – Run the Pipeline

1. Click **Build with Parameters**
2. Set `DOCKERHUB_USERNAME` to your Docker Hub username
3. Set `IMAGE_TAG` (e.g., `latest` or `v1.0.0`)
4. Click **Build**

### Pipeline Stages

| Stage | Description |
|---|---|
| Checkout | Pulls latest code from Git |
| Install Dependencies | `npm ci` for backend and frontend (parallel) |
| Static Code Analysis | ESLint on both backend and frontend (parallel) |
| Unit Tests | Jest unit tests on backend |
| Integration Tests | Jest integration tests with in-memory MongoDB |
| Test Coverage | Generates coverage report (threshold: 70%) |
| Build Frontend | `npm run build` (Vite production build) |
| Docker Login | Authenticates to Docker Hub |
| Build & Push Images | Builds and pushes backend + frontend images (parallel) |
| Deploy to Kubernetes | Applies K8s manifests and rolls out new images |

---

## 8. Ansible Configuration

Ansible is used to provision the server environment before deployment.

```bash
# Edit inventory file with your server IP
nano ansible/inventory

# Run the playbook (installs Docker, Node.js, kubectl)
ansible-playbook -i ansible/inventory ansible/main.yml

# Run with verbose output
ansible-playbook -i ansible/inventory ansible/main.yml -v

# Check syntax only
ansible-playbook -i ansible/inventory ansible/main.yml --syntax-check

# Dry run (check mode)
ansible-playbook -i ansible/inventory ansible/main.yml --check
```

---

## 9. Static Code Analysis (ESLint)

ESLint is configured on the backend to catch code quality issues.

### Run ESLint on Backend

```bash
cd backend

# Install dev dependencies (if not done)
npm install

# Run lint check
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

### What ESLint Checks

- `no-unused-vars` — warns on unused variables
- `no-console` — warns on console.log usage in production
- `eqeqeq` — enforces `===` over `==`
- `no-var` — enforces `const`/`let` over `var`
- `semi` — enforces semicolons
- `prefer-const` — suggests `const` where variable is not reassigned

### Run ESLint on Frontend

```bash
cd frontend
npm run lint
```

---

## 10. Unit Testing

Unit tests verify individual functions and modules in isolation, with **no database or network connections**.

```bash
cd backend

# Install test dependencies
npm install

# Run all unit tests
npm run test:unit
```

### What's Tested (Unit)

**`tests/unit/legalKnowledge.test.js`** — Tests the RAG suggestion engine:
- Knowledge base structure integrity (all required fields, unique IDs, valid urgency values)
- Criminal scenario detection (arrest, theft, fraud, assault)
- Family scenario detection (divorce, domestic violence, custody, maintenance)
- Civil scenario detection (property dispute, consumer complaint, tenant/landlord)
- Employment scenario detection (wrongful termination, POSH, unpaid salary)
- Cyber crime detection (OTP fraud, online defamation)
- Edge cases (unrecognised situations, mixed-case input, always returns primary)

---

## 11. Integration Testing

Integration tests test **real HTTP requests** against a live Express server backed by an **in-memory MongoDB** instance (no real database needed).

```bash
cd backend

# Run all integration tests
npm run test:integration
```

### What's Tested (Integration)

**`tests/integration/api.test.js`**:

| Endpoint | Tests |
|---|---|
| `POST /api/auth/register` | Successful registration, duplicate email rejection, lawyer registration |
| `POST /api/auth/login` | Successful login with token, wrong password, unknown email |
| `POST /api/suggestions` | Valid suggestion, empty body, too-short input, URGENT detection, laws array structure |
| `GET /health` | Health check returns 200 + timestamp |
| `GET /api/appointments/lawyers` | Returns lawyers without password field |
| `POST /api/appointments/book` | Successful booking, duplicate prevention |
| `GET /api/appointments/:id/user` | Returns correct user appointments |

---

## 12. Test Coverage Report

```bash
cd backend

# Run all tests and generate HTML coverage report
npm run test:coverage
```

Coverage report is saved to `backend/coverage/lcov-report/index.html`.

Open it in your browser:
```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Coverage Thresholds

The project enforces minimum coverage thresholds:
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 60%
- **Statements**: 70%

The build will fail in CI if thresholds are not met.

---

## 13. API Reference

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{name, email, password, role, domain?}` | Register user or lawyer |
| POST | `/api/auth/login` | `{email, password}` | Login, returns JWT token |

### Suggestions (RAG)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/suggestions` | `{situation: string}` | Get AI legal suggestion |

**Response:**
```json
{
  "primary": {
    "title": "Arrest / Police Custody",
    "category": "criminal",
    "urgency": "URGENT",
    "emergency": true,
    "recommendation": "...",
    "laws": [
      { "section": "Section 41 CrPC", "description": "..." }
    ]
  },
  "secondary": { ... }  // optional second match
}
```

### Appointments

| Method | Endpoint | Body / Params | Description |
|---|---|---|---|
| GET | `/api/appointments/lawyers` | — | List all registered lawyers |
| POST | `/api/appointments/book` | `{userId, lawyerId, description}` | Book an appointment |
| GET | `/api/appointments/:userId/:role` | `role = user | lawyer` | Get appointments by user/lawyer |
| PUT | `/api/appointments/:id/status` | `{status, quotePrice?, appointmentDate?}` | Update appointment status |
| DELETE | `/api/appointments/:id` | — | Delete cancelled appointment |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check — returns `{status: "OK", timestamp}` |

---

## 14. Environment Variables

### Backend (`.env`)

```env
MONGO_URI=mongodb://localhost:27017/devops_legal
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

Copy the example file to get started:
```bash
cp backend/.env.example backend/.env
```

### Frontend (Vite)

Create `frontend/.env` for custom API URL:
```env
VITE_API_URL=http://localhost:5000
```

In production (Docker/K8s), set `VITE_API_URL` to your backend service URL before building.

---

## 🚨 Troubleshooting

**MongoDB connection refused?**
```bash
# Start MongoDB locally
mongod --dbpath /data/db
```

**Port already in use?**
```bash
# Kill process on port 5000
npx kill-port 5000
# Kill process on port 3000
npx kill-port 3000
```

**Docker build fails on Windows?**
- Make sure Docker Desktop is running
- Use PowerShell or Git Bash (not CMD) for docker commands

**K8s pods in CrashLoopBackOff?**
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous
```

**Jenkins can't find Node.js?**
- Install the NodeJS Jenkins plugin
- Configure a Node.js installation in Manage Jenkins → Tools → NodeJS installations

---

## 📝 License

This project was created for academic purposes.
