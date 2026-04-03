# 🚀 QR Tanki - Complete Neon Database Setup Guide

## 📋 **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Manual Setup](#manual-setup)
4. [Database Configuration](#database-configuration)
5. [Auth System Setup](#auth-system-setup)
6. [Demo Data Setup](#demo-data-setup)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 **Prerequisites**

### **Required Software**
- **Node.js**: Version 18+ (recommended)
- **Bun**: Fast JavaScript package manager
- **Neon Account**: Free PostgreSQL database
- **Git**: Version control system

### **Neon Database Setup**
1. **Create Neon Account**: https://neon.tech
2. **Create Database**: 
   - Click "Create Project"
   - Choose PostgreSQL
   - Select region (recommended: ap-southeast-2)
   - Copy connection string

### **Connection String Format**
```
postgresql://neondb_owner:npg_eUhLkNPJc27D@ep-soft-frog-a7c0vavv-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🚀 **Quick Setup (Recommended)**

### **Option 1: Automated Setup**
```bash
# Clone the repository
git clone https://github.com/jitenkr2030/QR-Tanki.git
cd QR-Tanki

# Run the automated setup script
./setup-neon.sh
```

### **Option 2: Manual Quick Setup**
```bash
# Clone repository
git clone https://github.com/jitenkr2030/QR-Tanki.git
cd QR-Tanki

# Install dependencies
bun install

# Create environment file
cp .env.example .env.local

# Update .env.local with your Neon URL
# Add: DATABASE_URL="your-neon-connection-string"

# Setup database
bun run db:setup

# Start development server
bun run dev
```

---

## 🔧 **Manual Setup**

### **Step 1: Clone Repository**
```bash
git clone https://github.com/jitenkr2030/QR-Tanki.git
cd QR-Tanki
```

### **Step 2: Install Dependencies**
```bash
bun install
```

### **Step 3: Configure Environment**
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

**Required .env.local configuration:**
```env
# Database Configuration (Neon)
DATABASE_URL="postgresql://neondb_owner:npg_eUhLkNPJc27D@ep-soft-frog-a7c0vavv-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key"

# Application Configuration
NODE_ENV="development"
PORT=3000
DEMO_MODE="true"
DEMO_SEED_DATA="true"
```

### **Step 4: Generate Prisma Client**
```bash
bun run db:generate
```

### **Step 5: Push Schema to Neon**
```bash
bun run db:push
```

### **Step 6: Seed Database with Demo Data**
```bash
bun run db:seed
```

### **Step 7: Start Development Server**
```bash
bun run dev
```

### **Step 8: Access the Application**
- **Demo Page**: http://localhost:3000/demo
- **Main App**: http://localhost:3000

---

## 🗄️ **Database Configuration**

### **Prisma Schema Updates**
The platform now uses PostgreSQL with Neon. Key changes:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **Database Features**
- **PostgreSQL**: Robust, scalable database
- **Neon**: Serverless PostgreSQL with automatic scaling
- **Connection Pooling**: High-performance connection management
- **SSL/TLS**: Secure database connections
- **Channel Binding**: Enhanced security for PostgreSQL

### **Schema Highlights**
- **Users**: Role-based access (ADMIN, USER, CLEANER)
- **Tanks**: Water tank management with QR codes
- **Cleaners**: Service provider profiles and tracking
- **Bookings**: Service requests and scheduling
- **Payments**: Financial transactions and escrow
- **Wallet**: Digital wallet for users
- **Subscriptions**: Recurring service plans
- **Feedback**: Rating and review system

---

## 🔐 **Auth System Setup**

### **NextAuth Configuration**
The platform uses NextAuth.js with Neon PostgreSQL adapter:

```typescript
// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // ... other configuration
}
```

### **Auth Features**
- **Credentials Provider**: Email/password authentication
- **Session Management**: JWT-based sessions
- **Role-Based Access**: Admin, User, Cleaner roles
- **Database Sessions**: Persistent sessions in Neon
- **Secure Authentication**: Password hashing and verification

### **Demo Credentials**
All demo accounts use simple passwords for easy testing:
- **Admin**: `admin@qrtanki.com` / `Admin@123`
- **Cleaner**: `cleaner@qrtanki.com` / `Cleaner@123`
- **User**: `user@qrtanki.com` / `User@123`
- **Society**: `society@qrtanki.com` / `Society@123`
- **Emergency**: `emergency@qrtanki.com` / `Emergency@123`
- **Wallet**: `wallet@qrtanki.com` / `Wallet@123`

---

## 🌱 **Demo Data Setup**

### **Comprehensive Demo Data**
The platform includes rich demo data:

#### **Users (6 accounts)**
- **1 Admin**: Full system access
- **1 Cleaner**: Expert cleaner profile
- **4 Regular Users**: Different use cases

#### **Tanks (6 tanks)**
- **Various Types**: OVERHEAD, UNDERGROUND, SINTANK
- **Different Capacities**: 500L to 2000L
- **QR Codes**: Unique QR codes for each tank
- **Hygiene Scores**: Realistic scoring

#### **Services & Features**
- **Cleaning Records**: Completed services with feedback
- **Payments**: Transaction history and status
- **Subscriptions**: Active and expired subscriptions
- **Wallets**: Digital wallets with balances
- **Notifications**: System notifications for users

### **Data Relationships**
- **User → Tanks**: One-to-many relationship
- **User → Cleaner**: One-to-one for cleaners
- **Tank → QR Code**: One-to-one relationship
- **User → Wallet**: One-to-one relationship
- **Request → Record**: Service completion tracking

---

## 🧪 **Testing**

### **Quick Testing Checklist**
```bash
# 1. Test Database Connection
bun run db:push

# 2. Test Auth System
# Visit: http://localhost:3000/demo
# Try logging in with demo accounts

# 3. Test Core Features
# - Tank management
# - Booking system
# - User profiles
# - Admin dashboard

# 4. Test Offline Features
# - Disconnect from internet
# - Test offline navigation
# - Reconnect and test sync
```

### **Test Scenarios**
1. **Admin Login**: `admin@qrtanki.com` / `Admin@123`
2. **User Dashboard**: `user@qrtanki.com` / `User@123`
3. **Cleaner Portal**: `cleaner@qrtanki.com` / `Cleaner@123`
4. **Society Management**: `society@qrtanki.com` / `Society@123`
5. **Emergency Services**: `emergency@qrtanki.com` / `Emergency@123`
6. **Wallet Features**: `wallet@qrtanki.com` / `Wallet@123`

### **Database Testing**
```sql
-- Test database connection
SELECT version();

-- Test user data
SELECT * FROM users LIMIT 5;

-- Test tank data
SELECT * FROM tanks LIMIT 5;

-- Test relationships
SELECT u.name, t.name as tank_name 
FROM users u 
JOIN tanks t ON u.id = t.userId 
LIMIT 5;
```

---

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Database Connection Error**
```bash
# Error: "No such file or directory"
# Solution: Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Error: "Connection refused"
# Solution: Check Neon database status and connection string
```

#### **2. Prisma Generation Error**
```bash
# Error: "prisma generate failed"
# Solution: Update Prisma client and regenerate
bun add @prisma/client@latest
bun run db:generate
```

#### **3. Schema Push Error**
```bash
# Error: "schema push failed"
# Solution: Check database permissions and connection
# Reset database and try again
bun run db:reset
bun run db:push
```

#### **4. Auth Login Error**
```bash
# Error: "Invalid credentials"
# Solution: Check demo credentials in database
# Verify NEXTAUTH_SECRET is set

# Error: "Adapter error"
# Solution: Check Prisma adapter configuration
# Ensure database tables exist
```

#### **5. Build Error**
```bash
# Error: "Build failed"
# Solution: Check TypeScript errors
bun run lint
# Fix any TypeScript issues
bun run build
```

### **Debug Mode**
Enable debug mode for detailed logging:
```env
# Add to .env.local
NODE_ENV="development"
DEBUG="next-auth:*"
```

### **Database Reset**
If you need to start fresh:
```bash
# Reset database and reseed
bun run db:reset
bun run db:generate
bun run db:push
bun run db:seed
```

---

## 🚀 **Production Deployment**

### **Environment Variables for Production**
```env
# Production .env configuration
DATABASE_URL="your-production-neon-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-key"
NODE_ENV="production"
```

### **Deployment Steps**
1. **Update Environment**: Set production values
2. **Generate Prisma Client**: `bun run db:generate`
3. **Push Schema**: `bun run db:push`
4. **Seed Production Data**: Optional demo data
5. **Build Application**: `bun run build`
6. **Deploy to Hosting**: Vercel, Netlify, or other platform

### **Neon Production Best Practices**
- **Connection Pooling**: Configure appropriate pool size
- **SSL/TLS**: Always use secure connections
- **Backups**: Enable automatic backups
- **Monitoring**: Set up database monitoring
- **Scaling**: Configure auto-scaling if needed

---

## 📊 **Performance Optimization**

### **Database Optimization**
```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tanks_user_id ON tanks(userId);
CREATE INDEX idx_cleaning_requests_user_id ON cleaning_requests(userId);
CREATE INDEX idx_payments_user_id ON payments(userId);
```

### **Connection Pooling**
Neon automatically handles connection pooling, but you can configure:
```env
# Add to DATABASE_URL for connection pooling
?connection_limit=20&pool_timeout=10
```

### **Query Optimization**
- Use `select` fields to limit data returned
- Implement pagination for large datasets
- Use `where` clauses to filter data
- Cache frequently accessed data

---

## 🔧 **Advanced Configuration**

### **Custom Environment Variables**
```env
# Additional configuration options
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="your-neon-connection-string"
DEMO_MODE="true"
DEMO_SEED_DATA="true"

# Optional: Add your API keys
RAZORPAY_KEY_ID="your-razorpay-key"
RESEND_API_KEY="your-resend-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
```

### **Custom Database Configuration**
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Optional: Add schema
  // schema   = "qrtanki"
}
```

---

## 📞 **Support & Resources**

### **Documentation**
- **GitHub Repository**: https://github.com/jitenkr2030/QR-Tanki
- **Neon Documentation**: https://neon.tech/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth Documentation**: https://next-auth.js.org

### **Community Support**
- **GitHub Issues**: https://github.com/jitenkr2030/QR-Tanki/issues
- **GitHub Discussions**: https://github.com/jitenkr2030/QR-Tanki/discussions
- **Neon Community**: https://neon.tech/community

### **Getting Help**
1. **Check this guide**: Review troubleshooting section
2. **Search Issues**: Look for similar issues on GitHub
3. **Create Issue**: Provide detailed error information
4. **Join Discord**: Real-time community support

---

## 🎉 **Success Checklist**

### **✅ Setup Complete When**
- [ ] Neon database is connected and accessible
- [ ] Prisma schema is pushed to Neon
- [ ] Demo data is seeded successfully
- [ ] Auth system works with demo accounts
- [ ] Application loads without errors
- [ ] All demo accounts can log in
- [ ] Core features work as expected
- [ ] Offline functionality works correctly
- [ ] Build process completes successfully

### **✅ Ready for Production When**
- [ ] Environment variables are configured
- [ ] Database is optimized for production
- [ ] Security measures are implemented
- [ ] Performance is optimized
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Scaling plan is defined

---

## 🚀 **Next Steps**

### **For Development**
1. **Explore Features**: Test all platform features
2. **Customize UI**: Modify design and branding
3. **Add Features**: Implement custom requirements
4. **Optimize Performance**: Improve speed and efficiency
5. **Test Thoroughly**: Comprehensive testing

### **For Production**
1. **Configure Production**: Set up production environment
2. **Deploy Application**: Deploy to hosting platform
3. **Set Up Monitoring**: Implement monitoring and alerting
4. **Scale Database**: Configure scaling and optimization
5. **Launch Marketing**: Start acquiring customers

### **For Business**
1. **Custom Branding**: Add your logo and colors
2. **Payment Integration**: Set up real payment gateways
3. **Customer Support**: Set up support systems
4. **Marketing Launch**: Start marketing campaigns
5. **Scale Operations**: Prepare for growth

---

**🎉 The QR Tanki platform is now fully configured with Neon PostgreSQL database, complete authentication system, and comprehensive demo data!**

### **🌟 Platform Success**
- **✅ Neon Database**: Scalable, serverless PostgreSQL
- **✅ Auth System**: Secure authentication with role-based access
- **✅ Demo Data**: Comprehensive demo accounts and test data
- **✅ Offline Features**: Complete PWA offline experience
- **✅ Mobile Ready**: Perfect responsive design
- **✅ Production Ready**: Optimized for deployment and scaling

### **📱 Ready to Use**
- **Local Development**: `bun run dev`
- **Demo Access**: http://localhost:3000/demo
- **Admin Panel**: Full system administration
- **User Portal**: Complete user experience
- **Cleaner Portal**: Service provider management

---

**🚀 Start Using QR Tanki Now!**
```bash
# Start the development server
bun run dev

# Visit the demo page
open http://localhost:3000/demo

# Test with demo accounts
# Admin: admin@qrtanki.com / Admin@123
# User: user@qrtanki.com / User@123
# Cleaner: cleaner@qrtanki.com / Cleaner@123
```

**📱 QR Tanki - India's First QR-Based Water Tank Cleaning Platform with Neon PostgreSQL - Ready for Business Success!** 🚀📱💧🌍