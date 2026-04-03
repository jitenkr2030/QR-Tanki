#!/bin/bash

# QR Tanki Neon Database Setup Script
# This script sets up the complete platform with Neon PostgreSQL

echo "🚀 QR Tanki - Neon Database Setup"
echo "=================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your Neon database URL."
    echo "🔗 Your Neon URL should be:"
    echo "   postgresql://neondb_owner:npg_eUhLkNPJc27D@ep-soft-frog-a7c0vavv-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    echo ""
    echo "⚠️  Please update .env.local with your actual Neon database URL and run this script again."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local; then
    echo "❌ DATABASE_URL not found in .env.local"
    echo "📋 Please add your Neon database URL to .env.local:"
    echo "   DATABASE_URL=\"postgresql://neondb_owner:npg_eUhLkNPJc27D@ep-soft-frog-a7c0vavv-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\""
    exit 1
fi

echo "✅ Environment configuration found"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Generate Prisma client
echo "🔧 Generating Prisma client for Neon..."
bun run db:generate

# Push schema to Neon
echo "🗄️ Pushing schema to Neon PostgreSQL..."
bun run db:push

# Seed database with demo data
echo "🌱 Seeding Neon database with demo data..."
bun run db:seed

echo ""
echo "✅ Neon database setup completed!"
echo ""
echo "📱 Demo Account Credentials:"
echo "============================"
echo "Admin: admin@qrtanki.com / Admin@123"
echo "Cleaner: cleaner@qrtanki.com / Cleaner@123"
echo "User: user@qrtanki.com / User@123"
echo "Society: society@qrtanki.com / Society@123"
echo "Emergency: emergency@qrtanki.com / Emergency@123"
echo "Wallet: wallet@qrtanki.com / Wallet@123"
echo ""
echo "🌐 Start the development server:"
echo "   bun run dev"
echo ""
echo "📱 Visit the demo page:"
echo "   http://localhost:3000/demo"
echo ""
echo "🚀 QR Tanki is now ready with Neon PostgreSQL!"