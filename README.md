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
| Database       | PostgreSQL                        |
| Authentication | JWT-based token authentication    |
| Testing        | xUnit (C#), Jest (React)          |

---

## 📁 Project Structure

```plaintext
MonkeyAndRiver/
│
├── client/                # React frontend
│   └── src/
│       └── components/
│       └── pages/
│       └── tests/         # Frontend tests using Jest
│
├── server/                # ASP.NET Core backend
│   └── Controllers/
│   └── Models/
│   └── Services/
│   └── Tests/             # Backend tests using xUnit
│
├── README.md
└── docker-compose.yml     # Optional for deployment
