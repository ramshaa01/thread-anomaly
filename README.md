# Thread Anomaly — Local Setup Guide

> A full-stack e-commerce site for a streetwear/musicwear brand. Built with Next.js, MongoDB, JWT Auth, and Razorpay.

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Included with Node |
| MongoDB | 6+ (local) OR MongoDB Atlas (cloud) | https://www.mongodb.com/try/download/community |

---

## Step 1 — Open the Project

```bash
cd C:\Users\ramsh\.gemini\antigravity\scratch\thread-anomaly
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Configure Environment Variables

Copy the example file and fill it in:

```bash
# Windows
copy .env.example .env
```

Then open `.env` and update these values:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/thread-anomaly
JWT_SECRET=any_long_random_string_change_me

# Razorpay test keys (from dashboard.razorpay.com → Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx

# Cloudinary (optional — static placeholders used as fallback)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **MongoDB Atlas:** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thread-anomaly?retryWrites=true&w=majority`

---

## Step 4 — Seed the Database

Run this **once** to populate MongoDB with 12 products and 2 test users:

```bash
npm run seed
```

Expected output:

```
🔗 Connecting to MongoDB: mongodb://localhost:27017/thread-anomaly
✅ Connected.
🗑️  Cleared existing users and products.
👤 Seeded 2 users:
   admin@threadanomaly.com    / password: admin123    (role: admin)
   customer@threadanomaly.com / password: customer123 (role: customer)
👕 Seeded 12 products.
🎉 Database seeded successfully!
```

---

## Step 5 — Start the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Test Accounts (Seeded Automatically)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@threadanomaly.com` | `admin123` |
| Customer | `customer@threadanomaly.com` | `customer123` |

---

## End-to-End Flow Testing

### Guest Browse
1. Go to **http://localhost:3000** — hero, new arrivals and best sellers load from MongoDB
2. Click **Shop Now** → product grid with category/sort filters
3. Click any product card → detail page with size/color selectors
4. Try **Add to Bag** without logging in → redirected to `/login`

### Register & Login
1. Go to `/register` → fill in form → auto-logged in, redirected to `/shop`
2. Or go to `/login` → use `customer@threadanomaly.com` / `customer123`
3. Navbar updates to show Logout button

### Cart & Checkout
1. While logged in, go to a product page
2. Select size, click **Add to Bag** → cart badge updates in navbar
3. Click bag icon → go to `/checkout`
4. Step 1: review items, click **Proceed to Shipping**
5. Step 2: fill shipping info, click **Pay ₹XXX** → Razorpay popup (requires test keys in `.env`)

### Filters & Sort
1. On `/shop`, click category chips (Graphic Tees, Limited Drops, etc.)
2. Use the Sort dropdown → products re-order without page refresh

---

## Project Structure

```
thread-anomaly/
├── scripts/
│   └── seed.ts              ← npm run seed
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        ← /register /login /me /logout
│   │   │   ├── products/    ← GET list + GET by slug/id
│   │   │   └── razorpay/    ← /order (create) + /verify (signature)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── checkout/
│   │   ├── product/[id]/
│   │   ├── shop/
│   │   ├── about/
│   │   └── contact/
│   ├── components/
│   │   ├── layout/          ← Navbar, Footer
│   │   └── product/         ← ProductCard
│   ├── context/
│   │   ├── AuthContext.tsx  ← JWT/cookie session state
│   │   └── CartContext.tsx  ← Client-side cart (localStorage)
│   └── lib/
│       ├── db.ts            ← MongoDB connection with caching
│       └── models/
│           ├── User.ts      ← bcrypt hashed passwords
│           ├── Product.ts
│           └── Order.ts
├── .env.example             ← Copy to .env and fill in
└── README.md
```

---

## Razorpay Test Cards (Day 2)

When checking out in dev mode, use these exact Razorpay test details to simulate a successful payment:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/26`) |
| CVV | Any 3 digits (e.g. `123`) |
| OTP | `123456` |

---

## Running Automated Tests

Basic unit and integration tests (Jest) cover cart total calculation, Razorpay signature verification, and auth middleware.

```bash
npm run test
```

---

## Important Notes

* **Cloudinary:** To support real image uploads, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your `.env`. If these are omitted, the Admin UI allows you to paste standard URLs or use the fallback `/images/placeholder.svg`.
* **Security Flag:** 🚨 Before production deployment, remember to rotate the seeded passwords (`admin123`, `customer123`).

---

## Roadmap

| Day | Focus |
|-----|-------|
| **Day 1 ✅** | Full project generation, MongoDB seed, local end-to-end flows |
| **Day 2** | Live Razorpay test payment, My Orders, Wishlist, Profile |
| **Day 3** | Vercel deployment, MongoDB Atlas, live Razorpay keys, Cloudinary images |
