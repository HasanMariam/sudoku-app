# 🧩 Full-Stack Sudoku Game (Dockerized)

A complete Sudoku web application built with a modern tech stack, fully containerized using Docker, and automated with a CI/CD pipeline.

## 🚀 Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** MongoDB
- **Infrastructure:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## 🛠️ System Architecture
This project is structured as a microservices architecture:
* **Frontend**: Served on port `80`.
* **Backend**: API running on port `5000`.
* **Database**: MongoDB running on port `27017`.

## 📦 Automation (CI/CD)
The project uses **GitHub Actions** to automatically:
1.  Build Docker images for both Frontend and Backend on every push to the `main` branch.
2.  Push the latest images to **Docker Hub** (`hasanmar/sudoku-frontend` & `hasanmar/sudoku-backend`).

## ⚙️ How to Run
You don't need to install Node.js or MongoDB locally. You only need **Docker**.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/HasanMariam/sudoku-app.git](https://github.com/HasanMariam/sudoku-app.git)
    cd sudoku-app
    ```

2.  **Run the application:**
    ```bash
    docker-compose up -d
    ```

3.  **Access the game:**
    Open your browser and go to `http://localhost`.

## 📂 Project Structure
```text
.
├── frontend/       # React application & Dockerfile
├── backend/        # Node.js API & Dockerfile
├── .github/        # GitHub Actions workflows (CI/CD)
└── docker-compose.yml