# 📚 Digital Wallet API

A simple RESTful API to manage digital wallet transactions using Node.js, Express, and MongoDB. It supports user authentication, transaction history, and balance management.

---

## 🚀 Features

- 💳 User registration and authentication
- 📜 View transaction history
- 💰 Check wallet balance
- ➕ Add funds to wallet
- ➖ Withdraw funds from wallet
- 🔒 Secure password and validation

---

## 💠 Technologies Used

- **Express.js**
- **MongoDB**
- **TypeScript**
- **Zod** and **Mongoose** for request and schema validation
- **jsonwebtoken** for secure token-based authentication
- **passport** and **passport-local** for user authentication

---

## 📦 Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hazzaz-am/digital-wallet-API
cd digital-wallet-API
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the app

#### In development:

```bash
pnpm dev
```

#### In production:

```bash
pnpm build
pnpm start
```

---

## 📡 API Endpoints

### 📁 Collection: User

### ✅ `GET /api/v1/user`

#### Route Overview:

| Method   | Path        | Description                           |
| -------- | ----------  | ------------------------------------- |
| `POST`   | `/register` | Register a new user/agent             |
| `PATCH`  | `/:id`      | Update user information               |
| `GET`    | `/all-users`| Get all users information             |
| `GET`    | `/:id`      | Get single user information           |


---

### 📁 Collection: Auth

### ✅ `GET /api/v1/auth`

#### Route Overview:

| Method   | Path             | Description                           |
| -------- | ----------       | ------------------------------------- |
| `POST`   | `/login`         | Login a user/agent/admin              |
| `POST`   | `/logout`        | Logout a user/agent/admin             |
| `POST`   | `/refresh-token` | Refresh authentication token          |
| `POST`   | `/reset-password`| Reset password for a user/agent/admin |

---
### 📁 Collection: Wallet

### ✅ `GET /api/v1/wallet`

#### Route Overview:

| Method   | Path             | Description                                            |
| -------- | ----------       | ------------------------------------------------------ |
| `POST`   | `/create-wallet` | Create a new wallet for a user / agent                 |
| `POST`   | `/top-up`        | Add funds to a user's / agent wallet                   |
| `POST`   | `/send-money`    | Send money from a user to user or agent to user wallet |
| `POST`   | `/cash-in`       | Cash in balance to user's wallet from agent wallet     |
| `POST`   | `/cash-out`      | Cash out balance from user's wallet to agent wallet    |
| `GET`    | `/get-wallets`   | Get all wallets for a user / agent                     |
| `GET`    | `/my-wallet`     | Get the details of the authenticated user's wallet     |

---

### 📁 Collection: Transaction

### ✅ `GET /api/v1/transaction`

#### Route Overview:

| Method   | Path                   | Description                                              |
| -------- | ----------             | -------------------------------------------------------- |
| `GET`    | `/get-all-transactions`| Get all transactions for Admin                           |
| `GET`    | `/my-transactions`     | Get the details of the authenticated user's transactions |
| `GET`    | `/:id`                 | Get transaction details by ID                            |

---
## 👨‍💻 About Me

Hi, I'm Hazzaz Abdul Mannan — a passionate software developer specializing in full-stack development. I enjoy building practical web applications that solve real-world problems.
