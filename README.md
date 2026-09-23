# Thread Anomaly — Developer Setup Guide

> A full-stack e-commerce site for a streetwear/musicwear brand. Built with Next.js (App Router), MongoDB Atlas, JWT Auth, and Razorpay.

**Live site:** https://thread-anomaly.vercel.app  
**Repo:** https://github.com/ramshaa01/thread-anomaly

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.3.3 (App Router, Turbopack) |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT stored in HTTP-only cookies, bcrypt password hashing |
| Payments | Razorpay (test mode — switch to live once KYC approved) |
| Deployment | Vercel (auto-deploy from `master`) |
| Tests | Jest (8 tests across auth, cart, and Razorpay signature verification) |

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
copy .env.example .env
```

Fill in your `.env` with real values (see `.env.example` for all required keys). The critical ones:

```env
MONGODB_URI=          # Your MongoDB Atlas non-SRV connection string
JWT_SECRET=           # Long random string, minimum 32 chars
RAZORPAY_KEY_ID=      # rzp_test_... from Razorpay Dashboard
RAZORPAY_KEY_SECRET=  # From Razorpay Dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID=  # Same as RAZORPAY_KEY_ID (browser-exposed)
```

### 3. Seed the database (first-time only)

```bash
npm run seed
```

This inserts the **7 real products** at ₹749 each and creates two default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@threadanomaly.com` | *(set at seed time — rotate immediately after)* |
| Customer | `customer@threadanomaly.com` | *(set at seed time — rotate immediately after)* |

> **Important:** The seeded passwords are defaults only. Rotate them immediately after seeding via the admin panel or directly in MongoDB Atlas. The production database has already had these rotated.

### 4. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Product Catalog (7 real products)

All products are priced at ₹749 and served from MongoDB.

| Name | Category | Colors | Sizes |
|---|---|---|---|
| Hose Bee Lyin Tee | Graphic Tees | White | S M L XL |
| Circumcision Survivor | Oversized Fits | Black | M L XL XXL |
| Physique Powered By... | Oversized Fits | Black | L XL XXL |
| MILF (Man I Love Felines) | Graphic Tees | Black | S M L XL |
| Gynaecologist | Graphic Tees | Black | M L XL |
| Pull Up NOT OUT | Oversized Fits | Black | M L XL XXL |
| Eat Fresh | Graphic Tees | White | S M L XL |

Product images live in `public/images/products/`. Two products (Hose Bee Lyin, Physique Powered By...) have multi-image galleries.

---

## Key Architecture Notes

- **Admin protection:** `src/app/admin/layout.tsx` runs `getAdminUser()` server-side on every request — there is no client-side-only guard.
- **Razorpay order creation** (`src/app/api/razorpay/order/route.ts`): totals are calculated server-side from DB prices (not client-supplied amounts). Out-of-stock items (`stock <= 0`) are rejected at the API level with a customer-readable error, not just UI-disabled.
- **Cart:** Client-side only (localStorage via `CartContext.tsx`). No server-side cart persistence.
- **Razorpay verify** (`src/app/api/razorpay/verify/route.ts`): HMAC SHA-256 signature verified before any order is marked PAID.
- **Mongoose `isNew` warning:** `isNew` is a reserved Mongoose pathname. It produces a console warning on startup but does not break anything. Suppress with `suppressReservedKeysWarning: true` in the schema options if desired.

---

## Running Tests

```bash
npm run test
```

8 tests passing across 3 suites: `auth.test.ts`, `cart.test.ts`, `razorpay.test.ts`.

---

## Switching to Razorpay Live Mode

Once the client's KYC and bank account are approved by Razorpay:

1. Get the Live keys from Razorpay Dashboard → Settings → API Keys.
2. In Vercel, update these three environment variables:
   - `RAZORPAY_KEY_ID` → `rzp_live_...`
   - `RAZORPAY_KEY_SECRET` → live secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` → `rzp_live_...`
3. Trigger a Vercel redeploy (or push any commit).
4. Run one live micro-transaction to confirm end-to-end.

No code changes are required. The Razorpay SDK switches behavior entirely based on the key prefix.

---

## Razorpay Test Cards

Use these when testing checkout locally:

| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/26`) |
| CVV | Any 3 digits |
| OTP | `123456` |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/         → /register /login /logout /me
│   │   ├── products/     → GET list + GET by slug/id
│   │   ├── admin/        → admin product CRUD
│   │   ├── orders/       → user order history
│   │   └── razorpay/     → /order (create) + /verify (HMAC check)
│   ├── admin/            → role-protected dashboard
│   ├── checkout/         → multi-step checkout flow
│   ├── product/[id]/     → product detail page
│   ├── shop/             → filterable product grid
│   ├── about/
│   └── contact/
├── components/
│   ├── layout/           → Navbar, Footer
│   └── product/          → ProductCard
├── context/
│   ├── AuthContext.tsx   → JWT session state
│   └── CartContext.tsx   → localStorage cart
└── lib/
    ├── db.ts             → MongoDB connection (cached)
    ├── auth.ts           → requireAdmin / getAdminUser helpers
    ├── razorpay.ts       → HMAC signature verification utility
    ├── order.ts          → server-side order total calculation
    └── models/
        ├── User.ts
        ├── Product.ts
        └── Order.ts
```
