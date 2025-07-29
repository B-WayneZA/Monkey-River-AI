# HealthForge
## "Built for Life. Backed by Insight."

## 🐒 Monkey and River — AI for Health | Momentum Insurance Hackathon

**Monkey and River** is a full-stack health diagnostic monitoring platform developed for the **AI for Health** track in collaboration with **Momentum Insurance**.

This application empowers users and insurance providers to track diagnostic test results, receive intelligent health alerts, and proactively manage health-related risks. The theme "Monkey and River" symbolizes adaptability and the continuous flow of healthcare data and insights.

---

## 🚀 Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React (JavaScript, ECMAScript 6+) |
| Backend        | ASP.NET Core Web API (C#)         |
| Database       | Microsoft SQL Server              |
| Authentication | JWT-based token authentication    |
| Testing        | xUnit (C#), Jest (React)          |

---

# Setup Instructions
This helps evaluators run the app. You can add this under a “🛠️ Getting Started” section:

🛠️ Getting Started
Prerequisites
.NET  8 SDK
React
SQL Server 

Clone the repository
```
git clone https://github.com/yourusername/MonkeyAndRiver.git
cd MonkeyAndRiver
```
1. Backend Setup
```
cd server
dotnet restore
dotnet ef database update     # Applies migrations
dotnet run
```
2. Frontend Setup
```
cd frontend
npm install
npm start
```
# Testing Section
![Image](https://github.com/user-attachments/assets/ff0cb730-fc4c-43b7-9ead-63bfaa6e4af7)
![Image](https://github.com/user-attachments/assets/825d1377-dd5b-4404-8f02-d82f859f2f77)
<img width="1605" height="627" alt="image" src="https://github.com/user-attachments/assets/3da968f7-c594-4812-ba93-b88b40fc6574" />

## Running Tests
Backend (xUnit)
```
cd server
dotnet test
```
Frontend (Jest)
```
cd client
npm test
```
✅ 3. Architecture Justification (Add as new section)
To demonstrate separation of concerns, briefly describe how your app is modular and organized:

# Architecture & Design
Frontend is decoupled from the backend and communicates via RESTful APIs.

* Backend follows layered architecture:
* Controllers handle HTTP requests.
* Services contain business logic.
* Models represent database entities.
* Database is managed via Entity Framework Core and migrations.
* Authentication uses JWT tokens, and CORS is enabled for secure cross-origin requests.
Testing is split between frontend (Jest) and backend (xUnit).

# User Manual
## Register
![Image](https://github.com/user-attachments/assets/1df87927-88a8-40d2-909b-aeebea40ea02)

## Login
![Image](https://github.com/user-attachments/assets/7cc6d68c-c0f2-47c3-936e-4ff7d379ec8e)

## Dashboard
![Image](https://github.com/user-attachments/assets/3bfe7802-e2f2-416b-9533-11e93c9a5411)

## Health Checker
![h1](https://github.com/user-attachments/assets/aa404234-53eb-463f-869c-d27b7b9845c1)
![h2](https://github.com/user-attachments/assets/c8d52507-4d00-477b-bd9f-28199383f274)
![h3](https://github.com/user-attachments/assets/9de792a7-5395-4fe6-a14b-b5a3716456f6)
![h4](https://github.com/user-attachments/assets/86ac0695-64ef-4b25-975e-8bd8e02f61f9)

## AI health checker
![Image](https://github.com/user-attachments/assets/825d1377-dd5b-4404-8f02-d82f859f2f77)
![AI2](https://github.com/user-attachments/assets/4cd0cc9c-bb5e-47c9-ac7d-a79d7076909a)

## User profile
![uSERpROFILE](https://github.com/user-attachments/assets/71a1569f-21ef-42a6-8d03-870d952dcd8e)



# 📁 Project Structure

```plaintext
Monkey-River-AI/
│
├── frontend/                # React frontend
│   └── src/
│       └── components/
│       └── pages/
│       └── tests/         # Frontend tests using Jest
│
├── backend/                # ASP.NET Core backend
│   └── MonkeyAndRiver-Health-Forge
│        └── Controllers/
│        └── Models/
│        └── Services/
│        └── Migrations/           # Datat Seeding
│        └── Data/
│        └── Properties/                  
│
├── README.md
```
