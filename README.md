# Enterprise Event-Driven Authentication & Session Engine

A production-grade, highly scalable, and fault-tolerant asynchronous authentication and session management backend engineered for e-commerce platforms. Built using the **MERN Stack (Node.js, Express, MongoDB)** and orchestrated via **Redis & BullMQ** to achieve near-zero API request latency through temporal and process decoupling.

## 🏗️ System Architecture & Design Patterns

The application is structured around a professional **Layered Architecture Pattern** that strictly enforces separation of concerns, eliminating direct database coupling from business logic and network handling.

```text
[ CLIENT ] (React / Apidog)
   │
   │  (1) HTTP Request (Signup / Login / Reset)
   ▼
[ CONTROLLER LAYER ] ────► Handles HTTP protocols, request parsing, and status emissions
   │
   ▼
[ SERVICE LAYER ] ───────► Coordinates pure Business Logic, triggers crypto tasks
   │
   ├───► [ REPOSITORY LAYER ] ───► Exclusive gatekeeper for Mongoose Queries ──► [ MONGO DB ]
   │
   ├───► [ REDIS CACHE ENGINE ] ─► Ultra-fast Session Management / Device Revocation (1ms)
   │                                  (Stores session keys directly in Redis memory)
   │
   └───► [ TASK QUEUE ENGINE ] ──► Offloads heavy network I/O payloads ────────► [ REDIS DOCKER ]
                                                                                      │
                                                                                      ▼
                                                                             [ BACKGROUND WORKERS ]
```

### 📂 Directory Architecture
*   **`src/config/constants.js`**: Core configuration module utilizing frozen objects (`Object.freeze()`) to lock environment variables, collection markers, and queue channels to eliminate runtime typo bugs.
*   **`src/config/redisCache.js`**: 🆕 Dedicated core in-memory caching connector linking your services directly to Redis session store data strings independently of task streaming vectors.
*   **`src/models/`**: Data structural design models separating short-lived validation metadata (`Otp` schema with MongoDB automatic Time-To-Live self-cleaning) from persistent operational items (`User` schema).
*   **`src/repositories/`**: The exclusive data access abstraction layer (`userRepo.js`, `otpRepo.js`). No other code vectors are permitted to execute Mongoose queries.
*   **`src/services/`**: Core workflow coordination. Manages operations mapping between data layers, message channels, and caching sessions.
*   **`src/controllers/` & `src/routes/`**: Protocol routers sanitizing parameters, utilizing **Zod Schemas** validation middleware guards before passing down execution blocks.
*   **`src/workers/`**: Dedicated background runtime engines executing asynchronous, resource-heavy tasks outside the main Express execution loop.
*   **`src/emailTemplates/`**: A clean rendering layout directory component isolating stylized HTML templates via module literals (`baseLayout.js`, `authTemplates.js`).

---

## 🚀 Key Deliverables & System Features

### 1. Asynchronous Process Decoupling
The application is split into **two completely independent runtime processes**:
*   **API Gateway Server (`server.js`)**: An Express cluster listening on Port 5000 that processes inputs and cuts connection handshakes in under 20ms.
*   **Queue Processor Node (`worker-runner.js`)**: A portless standalone server process that continuously polls the Redis instance to fulfill heavy notification scripts without freezing web traffic.

### 2. E-Commerce Session & Role Governance (RBAC)
*   **E-Commerce Identity Roles**: Native tracking data supports **BUYER**, **SELLER**, and **ADMIN** roles, utilizing customized middleware restrictions to guard platform-sensitive routes (e.g., adding inventory).
*   **Dual-Token JWT Rotation Architecture**: Emits short-lived Access Tokens in volatile JSON memory alongside long-lived Refresh Tokens embedded inside cryptographically secured **HTTP-Only Cookies**, making the web state immune to Cross-Site Scripting (XSS) interceptors.
*   **In-Memory Session Caching Engine**: Integrates a dedicated standalone Redis connection pipeline (`redisCache.js`) tracking current `tokenVersion` arrays, allowing single-click global device logging-out and access-revoking profiles in less than **1 millisecond**.

### 3. Fault-Tolerance & Production Defenses
*   **Fail-Safe Asynchronous Boot-Strapping**: The background worker core forces synchronization with **MongoDB Compass** via dynamic ES Module `await import()` wrappers *before* accepting network tasks from the Redis stream, eliminating application boot race conditions.
*   **Exponential Backoff Queue Retries**: Background job workers natively run up to 3 automatic delivery attempts with expanding time padding, isolating network errors during SMTP communication.
*   **Durable Dead-Letter-Queue (DLQ) Archiving**: If a task exhausts its fallback retries, a custom listener halts execution and archives the entire data blueprint and context into a persistent **`queueerrorlogs` MongoDB database collection** for administrative auditing.
*   **Anti-Brute Force Account Locks**: Active counter metrics guard the verification process, immediately tracking failed input attempts in the data store and burning authentication files if a user types a wrong code 5 times.

---

## 🛠️ Environmental Settings & Prerequisites

Create a `.env` file in your root folder layout:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/enterprise_app_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SALT_ROUNDS=10

JWT_ACCESS_SECRET=your_super_secure_access_secret_key_string
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_string

EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-authenticated-username@gmail.com
EMAIL_PASSWORD=your_16_character_google_app_password
EMAIL_FROM=your-authenticated-username@gmail.com
```

---

## 🏃‍♂️ How to Run Locally

### 1. Start the Messaging & Storage Engines (Docker Containers)
Ensure your local Docker Desktop application is running, then boot up your containers:
```bash
# Start your local Redis container cache
docker run -d --name otp-redis -p 6379:6379 redis:latest

# Start your local MongoDB instance (if not running natively)
docker run -d --name local-mongo -p 27017:27017 mongo:latest
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Run the Distributed Application Nodes (Two Separate Terminals)

*   **Terminal 1 (Start the Web API Server)**:
    ```bash
    node src/server.js
    ```
*   **Terminal 2 (Start the Background Queue Worker)**:
    ```bash
    node src/worker-runner.js
    ```

---

## 🧪 API Endpoint Specifications (Tested via Apidog)

| Method | Endpoint | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | `{"email", "password", "role"}` | Validates schema payload, saves user as `PENDING`, pushes OTP job into Redis. |
| `POST` | `/api/auth/verify-otp` | `{"userId", "otp"}` | Verifies OTP code, shifts status to `ACTIVE`, clears tokens, triggers **Welcome Email Task**. |
| `POST` | `/api/auth/login` | `{"email", "password"}` | Validates status logs, emits access payload JSON, issues an **HTTP-Only Refresh Cookie** and registers version cache in Redis. |
| `POST` | `/api/auth/forgot-password` | `{"email"}` | Verifies entity existence, pushes specialized **Password Reset OTP Task** into the queue. |
| `POST` | `/api/auth/reset-password` | `{"userId", "otp", "newPassword"}` | Validates reset code, commits password change, and **revokes all active sessions** instantly inside the Redis Cache Engine. |
