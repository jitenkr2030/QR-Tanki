# QR Tanki - Water Tank Cleaning Management System

<div align="center">

![QR Tanki Logo](https://img.shields.io/badge/QR%20Tanki-Water%20Tank%20Management-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**India's First QR-Based Water Tank Cleaning Platform**

[Live Demo](#) • [Documentation](#documentation) • [Report Bug](#) • [Request Feature](#)

</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Pricing](#pricing)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🌟 About

QR Tanki is a comprehensive water tank cleaning management system that revolutionizes how homeowners and businesses maintain their water tanks. By leveraging QR code technology, we provide transparency, accountability, and convenience in water tank cleaning services.

### 🎯 Mission

To ensure clean and safe drinking water for every Indian household through professional, trackable, and affordable water tank cleaning services.

### 👥 Target Audience

- **Homeowners**: Individual house owners and apartment residents
- **Societies**: Residential societies and apartment complexes
- **Businesses**: Hotels, restaurants, and commercial establishments
- **Service Providers**: Professional cleaning companies and individual cleaners

## ✨ Features

### 🏠 For Homeowners

- **QR Code Generation**: Unique QR codes for each tank with printable stickers
- **Tank Management**: Complete tank profile with capacity, type, and location details
- **Cleaning History**: Track all past cleanings with photos and hygiene scores
- **Subscription Plans**: Affordable monthly and annual cleaning plans
- **Digital Certificates**: "Tank Clean Verified" badges for property value
- **Smart Reminders**: Automated alerts for cleaning due dates
- **One-Time Services**: Book single cleaning services without subscription

### 👨‍🔧 For Service Providers

- **Professional Profiles**: Showcase experience, service areas, and ratings
- **Job Management**: View assigned cleaning tasks and schedules
- **Earnings Tracking**: Monitor monthly income and payment status
- **Rating System**: Build reputation through customer feedback
- **Availability Management**: Set working hours and service areas

### 🛠️ For Administrators

- **User Management**: Oversee all users, cleaners, and subscriptions
- **Payment Tracking**: Monitor all transactions and revenue
- **Quality Control**: Verify cleaning records and photos
- **Analytics Dashboard**: Comprehensive insights and reports
- **Customer Support**: Handle disputes and user inquiries

## 💰 Pricing

### 📱 QR Code Sticker
- **Price**: ₹499 (one-time)
- **Includes**: Printable QR sticker, online tracking, tank profile
- **Annual Renewal**: ₹199/year for continued service

### 📅 Subscription Plans

| Plan | Price | Frequency | Features |
|------|-------|-----------|----------|
| **Basic** | ₹399/month | 1 cleaning/month | Basic cleaning, photo proof, email reminders |
| **Premium** | ₹599/month | 2 cleanings/month | Deep cleaning, water testing, priority support, digital certificate |

### 🔧 One-Time Services
- **Single Cleaning**: ₹699 per session
- **Deep Cleaning**: ₹899 per session
- **Emergency Cleaning**: ₹1,299 per session

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand, React Query

### Backend
- **API**: Next.js API Routes
- **Database**: Prisma ORM
- **Database Engine**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js
- **File Upload**: Built-in Next.js handling

### DevOps & Tools
- **Package Manager**: Bun
- **Code Quality**: ESLint, TypeScript
- **Version Control**: Git
- **Deployment**: Vercel (recommended), Docker support

## 🚀 Installation

### Prerequisites

- Node.js 18+ or Bun runtime
- Git
- Code editor (VS Code recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/jitenkr2030/QR-Tanki.git
cd QR-Tanki

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Set up database
bun run db:push

# Generate Prisma client
bun run db:generate

# Seed demo data (optional)
curl -X POST http://localhost:3000/api/seed

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External services
# UPLOADTHING_SECRET="your-uploadthing-secret"
# UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## ⚙️ Configuration

### Database Setup

The application uses Prisma ORM with SQLite for development. For production:

1. **PostgreSQL Setup**:
   ```bash
   # Install PostgreSQL CLI
   # Update DATABASE_URL in .env.local
   DATABASE_URL="postgresql://user:password@localhost:5432/qrtanki"
   
   # Run migrations
   bun run db:migrate
   ```

2. **Seed Production Data**:
   ```bash
   # Create admin user
   bun run seed:production
   ```

### Authentication Configuration

Update `src/lib/auth.ts` for production:

```typescript
// Add OAuth providers
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    // Add Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Existing credentials provider
  ],
  // ... other config
}
```

## 📖 Usage

### Demo Accounts

After seeding the database, use these accounts to explore:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Homeowner | homeowner@qrtanki.com | any | User dashboard |
| Cleaner | cleaner@qrtanki.com | any | Cleaner dashboard |
| Admin | admin@qrtanki.com | any | Admin panel |

### Key Workflows

#### 1. Homeowner Workflow
1. **Sign up** as a homeowner
2. **Add tank** details (type, capacity, location)
3. **Generate QR code** (₹499 one-time)
4. **Download & print** QR sticker
5. **Stick QR code** on tank
6. **Book cleaning** (subscription or one-time)
7. **Track history** by scanning QR code

#### 2. Cleaner Workflow
1. **Sign up** as a service provider
2. **Complete profile** (experience, service area)
3. **Receive job** notifications
4. **Update cleaning** records with photos
5. **Get paid** for completed jobs
6. **Build rating** through quality service

#### 3. Admin Workflow
1. **Login** as administrator
2. **Monitor users** and activities
3. **Verify cleaning** records
4. **Handle payments** and disputes
5. **Generate reports** and analytics

## 📚 API Documentation

### Authentication

All API endpoints require authentication except for public QR code scanning.

```bash
# Sign in
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Tank Management

```bash
# Create tank
POST /api/tanks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Main Water Tank",
  "type": "Overhead",
  "capacity": "1000 Liters",
  "location": "Rooftop - Building A"
}

# Get user tanks
GET /api/tanks
Authorization: Bearer <token>
```

### QR Code Operations

```bash
# Generate QR code
POST /api/qrcode
Authorization: Bearer <token>
Content-Type: application/json

{
  "tankId": "tank_id_here"
}

# Scan QR code (public)
GET /api/qrcode?code=QT-123456
```

### Demo Data

```bash
# Seed demo data
POST /api/seed
```

## 🗄️ Database Schema

The application uses a comprehensive relational database with the following main entities:

```mermaid
erDiagram
    User ||--o{ Tank : owns
    User ||--o{ Subscription : has
    User ||--o{ CleaningRequest : creates
    User ||--|| Cleaner : is
    Tank ||--|| QRCode : has
    Tank ||--o{ CleaningRecord : has
    Tank ||--o{ CleaningRequest : for
    Cleaner ||--o{ CleaningRecord : performs
    CleaningRequest ||--o{ Payment : requires
    Subscription ||--o{ Payment : generates
    QRCode ||--o{ Payment : requires
    CleaningRecord ||--o{ Feedback : receives
    Cleaner ||--o{ Earning : earns
```

### Key Models

- **User**: Authentication and role management (USER, CLEANER, ADMIN)
- **Tank**: Water tank information and QR code linking
- **QRCode**: Unique codes for tank identification
- **CleaningRecord**: Service history with photos and ratings
- **Subscription**: Recurring cleaning plans
- **Payment**: Transaction tracking across all services

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Code Style

```bash
# Lint code
bun run lint

# Format code
bun run format

# Type check
bun run type-check
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   ```bash
   # Reset database
   bun run db:reset
   bun run db:push
   ```

2. **Authentication Issues**:
   ```bash
   # Clear NextAuth session
   # Delete cookies and retry login
   ```

3. **Build Errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   bun run dev
   ```

### Getting Help

- 📧 Email: support@qrtanki.com
- 💬 Discord: [Join our community](#)
- 📱 WhatsApp: +91 98765 43210

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

## 📞 Contact

- **Website**: [qrtanki.com](https://qrtanki.com)
- **Email**: hello@qrtanki.com
- **Phone**: +91 98765 43210
- **Address**: 123, Water Street, Mumbai, Maharashtra 400001

---

<div align="center">

**Made with ❤️ in India**

© 2024 QR Tanki. All rights reserved.

</div>