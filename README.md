POS Platform — Full Documentation

A modern, full-stack Point-of-Sale (POS) system built with a Laravel 12 REST API and a Next.js 16 frontend.
Designed for scalability, speed, and developer productivity.

--------------------------------------------------------------------------------

PROJECT STRUCTURE
pos-backend/  → Laravel 12 API (PHP 8.2)
pos-frontend/ → Next.js 16 (TypeScript)

Both applications communicate via REST API secured with Laravel Sanctum.

--------------------------------------------------------------------------------

BACKEND — Laravel 12 (pos-backend)

Tech Stack:
- Laravel 12
- PHP 8.2+
- Sanctum Authentication
- Eloquent ORM
- MySQL/MariaDB
- Faker

Responsibilities:
- Authentication & session management
- Product, inventory & order logic
- Secure REST API
- Reporting
- Database migrations

--------------------------------------------------------------------------------

FRONTEND — Next.js 16 (pos-frontend)

Tech Stack:
- Next.js 16
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
- Shadcn
- Middleware proxy
- Context API

Responsibilities:
- POS interface
- Cart & checkout flow
- Inventory view
- cookie based authentication

--------------------------------------------------------------------------------

ENVIRONMENT VARIABLES

Backend (.env):
APP_URL=http://localhost:8000
DB_DATABASE=pos_db
DB_USERNAME=root
DB_PASSWORD=

Frontend (.env.local):
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

--------------------------------------------------------------------------------

INSTALLATION & SETUP

1. Clone Project:
git clone <repo>
cd pos-platform

2. Backend Setup:
cd pos-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

3. Frontend Setup:
cd pos-frontend
npm install
cp .env.example .env.local
npm run dev

--------------------------------------------------------------------------------

PRODUCTION BUILD

Backend:
php artisan optimize
chmod -R 775 storage bootstrap/cache

Frontend:
npm run build
npm start


