# 🎤 KTV Room Reservation & Management System

A full-stack web application designed to streamline KTV room reservations, food ordering, and online payments. The system provides a seamless booking experience for customers while offering administrators full control over rooms, food items, and promotional discounts.

---

## 📌 Project Overview

The **KTV Room Reservation & Management System** allows users to reserve KTV rooms, order food and beverages, and complete payments online using **PayMongo**. Bookings are automatically confirmed upon successful payment, eliminating the need for manual approval.  

An admin dashboard enables efficient management of rooms, menu items, and discounts through complete CRUD functionality.

---

## ✨ Key Features

### Customer Features
- **Room Reservation**
  - View available KTV rooms
  - Select preferred date and time slots
  - Automatic booking confirmation

- **Food & Beverage Ordering**
  - Browse available menu items
  - Add orders during the reservation process
  - Real-time price calculation

- **Online Payment**
  - Secure payment processing via **PayMongo**
  - Supports cards and e-wallets (GCash, Maya)
  - Payment status is synced with booking records

- **Booking Summary**
  - View reservation details, orders, discounts, and payment status

---

### Admin Features
- **Room Management**
  - Create, update, and delete KTV rooms
  - Manage room pricing and availability

- **Food & Menu Management**
  - Full CRUD operations for food and beverage items
  - Update prices and availability in real time

- **Discount Management**
  - Create and manage promotional discounts
  - Apply discounts dynamically during checkout

- **Reservation Monitoring**
  - View all bookings and order details
  - Track payment status and transaction history

---

## ⚙️ System Behavior
- Bookings are **automatically accepted** once payment is confirmed
- No manual admin approval required
- Total cost is calculated dynamically:


---

## 💳 Payment Integration
- Integrated with **PayMongo** for secure online payments
- Supports:
- Credit & Debit Cards
- GCash
- Maya
- Ensures reliable transaction handling and payment validation

---

## 🧱 Tech Stack

- **Frontend:** Next.js
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **Payment Gateway:** PayMongo

---

## 🔧 Installation & Setup

```
# Clone the repository
git clone https://github.com/your-username/ktv-reservation-system.git

# Install dependencies
npm install

# Run the development server
npm run dev
