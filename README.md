# 🧩 Full-Stack Sudoku Ecosystem (Redis & Kubernetes)

A high-performance, fully containerized Sudoku application built from scratch. This project showcases a complete transition from local development to a cloud-ready orchestrated environment.

## 🚀 Tech Stack
- **Frontend:** React (Vite) + Nginx Reverse Proxy
- **Backend:** Node.js (Express)
- **Database:** Redis (Alpine) - *High-speed in-memory storage*
- **Infrastructure:** Docker, Docker Compose & Kubernetes (K8s)
- **CI/CD:** GitHub Actions

## 🏗️ System Architecture & Engineering
I engineered this project as a modern microservices architecture:
* **From Scratch:** Every line of code in the Frontend, Backend, and Docker configurations was authored manually.
* **Reverse Proxy:** Used **Nginx** inside the Frontend container to securely route API calls and eliminate CORS issues.
* **Leaderboard Logic:** Implemented **Redis Sorted Sets** for ultra-fast, real-time player ranking.
* **Networking:** Configured internal service discovery so components communicate via a dedicated virtual network.

## 🛠️ Components
* **Frontend**: Served on port `80`.
* **Backend**: API running on port `5000`.
* **Database**: Redis running on port `6379`.

## 📦 Automation (CI/CD)
The project uses **GitHub Actions** to automatically:
1.  Build fresh Docker images for both services on every push to `main`.
2.  Push images to **Docker Hub** (`hasanmar/sudoku-frontend` & `hasanmar/sudoku-backend`).

## ⚙️ How to Run
You don't need to install Node.js or MongoDB locally. You only need 

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HasanMariam/sudoku-app.git
    ```
    ```bash
    cd sudoku-app
    ```

**Using Docker**

2.  **Run the application:**
    ```bash
    docker-compose up -d
    ```

3.  **Access the game:**
    Open your browser and go to `http://localhost`.


**Using Kubernetes**

2. **Deploy the unified cluster manifest**
    ```bash
    kubectl apply -f sudoku-all.yaml
    ```

3. **Attaching a service to the front-end of the deployment**
    ```bash
    minikube service frontend-service   
    ```

## 📂 Project Structure
```text
.
├── frontend/        # React application, Nginx config & Dockerfile
├── backend/         # Node.js API (Redis Edition) & Dockerfile
├── .github/         # GitHub Actions workflows (CI/CD)
├── sudoku-all.yaml  # Kubernetes Deployment & Service Manifest
└── docker-compose.yml