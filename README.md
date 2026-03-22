# Payment Checkout App

A full-stack payment checkout application built with Vue.js and NestJS, integrated with a payment gateway for credit card processing.

## 🚀 Live Demo

- **Frontend:** https://quillalab.app
- **Backend API:** https://quillalab.app/api/v1

## 📦 Repositories

- **Frontend:** https://github.com/your-username/payment-frontend
- **Backend:** https://github.com/your-username/payment-backend

---

## 🏗️ Architecture

### Backend — Hexagonal Architecture + Ports & Adapters
```
src/
├── modules/
│   ├── products/
│   │   ├── domain/          # Pure domain entities + repository ports
│   │   ├── application/     # Use cases (business logic)
│   │   └── infrastructure/  # Controllers + TypeORM adapters
│   ├── customers/
│   ├── transactions/
│   │   └── infrastructure/
│   │       └── wompi/       # External payment gateway adapter
│   └── deliveries/
└── shared/
    ├── result.ts            # Railway Oriented Programming (ROP)
    └── use-case.interface.ts
```

**Key decisions:**
- Business logic lives exclusively in `application/use-cases` — never in controllers
- Controllers only delegate to use cases and map HTTP responses
- External dependencies (Wompi, DB) are hidden behind ports (interfaces)
- All use cases return `Result<T, E>` following Railway Oriented Programming

### Frontend — Flux Architecture with Pinia
```
src/
├── api/          # HTTP adapters (axios + fetch)
├── stores/       # Pinia store (State, Mutations, Actions, Getters)
├── views/        # Page components
├── components/
│   ├── ui/       # Base components (BaseButton, BaseInput, BaseCard)
│   ├── layout/   # AppHeader, StepIndicator
│   ├── products/ # ProductCard, ProductList
│   └── checkout/ # CheckoutModal, PaymentBackdrop, CardForm, DeliveryForm
└── utils/        # card.ts (Luhn, brand detection), currency.ts
```

**Pinia store follows Flux pattern:**
- `STATE` — single source of truth
- `MUTATIONS` — synchronous state changes (uppercase naming convention)
- `ACTIONS` — async operations (tokenizeAndSaveCustomer, processPayment)
- `GETTERS` — computed values (isApproved, isFinished, totalCents)

---

## 🗄️ Data Model
```
┌─────────────────┐     ┌─────────────────┐
│    products     │     │    customers    │
├─────────────────┤     ├─────────────────┤
│ id (UUID) PK    │     │ id (UUID) PK    │
│ name            │     │ name            │
│ description     │     │ email (unique)  │
│ price_cents     │     │ phone           │
│ stock           │     │ created_at      │
│ image_url       │     └────────┬────────┘
│ created_at      │              │
└────────┬────────┘              │
         │                       │
         │     ┌─────────────────▼────────────────┐
         │     │           transactions           │
         │     ├──────────────────────────────────┤
         └────►│ id (UUID) PK                     │
               │ customer_id (UUID) FK            │
               │ product_id (UUID) FK             │
               │ status (PENDING/APPROVED/        │
               │         DECLINED/ERROR)          │
               │ amount_cents                     │
               │ base_fee_cents                   │
               │ delivery_fee_cents               │
               │ wompi_transaction_id             │
               │ created_at                       │
               │ updated_at                       │
               └────────────────┬─────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │      deliveries      │
                    ├──────────────────────┤
                    │ id (UUID) PK         │
                    │ transaction_id FK    │
                    │ customer_id FK       │
                    │ product_id FK        │
                    │ status (PENDING/     │
                    │  ASSIGNED/SHIPPED)   │
                    │ created_at           │
                    └──────────────────────┘
```

---

## 🔄 Business Flow
```
1. Product Page    → Browse products with stock availability
2. Checkout Modal  → Enter credit card data + delivery information
                     Card tokenization handled directly by payment gateway
3. Payment Summary → Review order breakdown (product + base fee + delivery fee)
                     Backdrop component per Material Design spec
4. Processing      → Create PENDING transaction → Call payment gateway
                     Poll until APPROVED/DECLINED → Update stock + Create delivery
5. Result Page     → Show transaction result → Redirect to products
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List all products with stock |
| POST | `/api/v1/customers` | Create or find customer by email |
| POST | `/api/v1/transactions` | Create transaction in PENDING status |
| POST | `/api/v1/transactions/process` | Process payment with card token |
| GET | `/api/v1/transactions/:id` | Get transaction status |
| GET | `/api/v1/deliveries/:transactionId` | Get delivery by transaction |

📮 **Postman Collection:** [Download here](https://github.com/your-username/payment-backend/blob/main/postman_collection.json)

---

## 🧪 Test Coverage

### Backend (NestJS + Jest)
```
Test Suites: 12 passed, 12 total
Tests:       53 passed, 53 total

File                                        | % Stmts | % Branch | % Funcs | % Lines
--------------------------------------------|---------|----------|---------|--------
All files                                   |   95.68 |    85.71 |   88.57 |   95.5
modules/customers/application/use-cases     |     100 |      100 |     100 |    100
modules/deliveries/application/use-cases    |     100 |      100 |     100 |    100
modules/products/application/use-cases      |     100 |      100 |     100 |    100
modules/transactions/application/use-cases  |     100 |    76.92 |     100 |    100
modules/transactions/domain                 |     100 |      100 |     100 |    100
shared                                      |     100 |      100 |     100 |    100
```

### Frontend (Vue + Vitest)
```
Test Suites: 4 passed, 4 total
Tests:       53 passed, 53 total

File              | % Stmts | % Branch | % Funcs | % Lines
------------------|---------|----------|---------|--------
All files         |   91.27 |    69.81 |    93.1 |  91.91
src/stores        |   90.56 |    63.63 |   91.3  |  91.83
src/utils/card    |     100 |      100 |     100 |    100
src/utils/currency|     100 |      100 |     100 |    100
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL + TypeORM
- **Architecture:** Hexagonal (Ports & Adapters)
- **Pattern:** Railway Oriented Programming (ROP)
- **Security:** Helmet (OWASP headers), class-validator
- **Testing:** Jest + ts-jest

### Frontend
- **Framework:** Vue 3 + TypeScript
- **State Management:** Pinia (Flux Architecture)
- **Router:** Vue Router
- **Styling:** Tailwind CSS + Custom CSS (Flexbox/Grid)
- **Testing:** Vitest + @vue/test-utils
- **HTTP:** Axios + Fetch API

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Docker + Docker Compose

### Backend
```bash
# Clone and install
cd payment-backend
pnpm install

# Start database
docker-compose up -d

# Configure environment
cp .env.example .env

# Start development server
pnpm start:dev

# Run tests
pnpm test:cov
```

### Frontend
```bash
cd payment-frontend
pnpm install

# Configure environment
cp .env.example .env

# Start development server
pnpm dev

# Run tests
pnpm test:coverage
```

---

## 🔐 Security

- **Helmet** — OWASP security headers (CSP, HSTS, XSS protection)
- **CORS** — Restricted to frontend origin
- **Sensitive data** — Card data and tokens never persisted to localStorage
- **Input validation** — class-validator on all DTOs
- **Luhn algorithm** — Client-side card number validation
- **UUID validation** — ParseUUIDPipe on all route parameters

---

## 📱 Responsive Design

- Mobile-first approach
- Minimum supported: iPhone SE 2020 (375px)
- Tested on: Chrome, Firefox, Safari, Edge
- Bottom sheet modals on mobile, centered modals on desktop

---

## ☁️ Cloud Infrastructure (AWS)
```
Frontend  → S3 + CloudFront (CDN)    → https://quillalab.app
Backend   → ECS Fargate + ALB        → https://quillalab.app/api/v1
Database  → RDS PostgreSQL           → payment-db.c8rqs642295k.us-east-1.rds.amazonaws.com
SSL       → ACM Certificate          → quillalab.app + *.quillalab.app
CDN       → CloudFront Distribution  → E22MP1YYF9SUJY
Region    → us-east-1 (N. Virginia)
```

### Architecture Diagram
```
                        ┌─────────────────────────────────┐
                        │         quillalab.app            │
                        │      CloudFront (HTTPS/CDN)      │
                        └──────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                      │
           Path: /*                               Path: /api/*
                    │                                      │
          ┌─────────▼─────────┐              ┌────────────▼────────────┐
          │     S3 Bucket     │             │  Application Load        │
          │  (Vue.js SPA)     │             │  Balancer (ALB)          │
          └───────────────────┘              └────────────┬────────────┘
                                                          │
                                             ┌────────────▼────────────┐
                                             │    ECS Fargate          │
                                             │    (NestJS API)         │
                                             └────────────┬────────────┘
                                                          │
                                             ┌────────────▼────────────┐
                                             │    RDS PostgreSQL       │
                                             │    (payment_db)         │
                                             └─────────────────────────┘
```

---
> ⚠️ **Note:** Pinia was chosen over Vuex as it is the officially recommended state management solution for Vue 3, following the same Flux Architecture principles. Vuex is currently in maintenance mode.