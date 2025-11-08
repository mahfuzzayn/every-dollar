# EveryDollar

A modern, full-stack personal expense management application with budget tracking, built with Next.js and MongoDB. Features a bold Neobrutalism design aesthetic with real-time expense tracking and comprehensive data visualization.

## 🌐 Live Demo

Click on here: [View Live Site](https://everydolllar.vercel.app)

## 📋 Overview

EveryDollar is a comprehensive expense management dashboard that helps users track their spending, visualize financial patterns, and stay within their monthly budgets. The application features:

- **User Authentication**: Secure sign-up and login with JWT token-based authentication
- **Expense Management**: Add, edit, and delete expenses with categories and date tracking
- **Budget Tracker**: Set monthly spending budgets with real-time progress indicators
- **Data Visualization**: Interactive charts showing spending by category and monthly trends
- **Filtering & Search**: Filter expenses by category and month
- **Responsive Design**: Beautiful Neobrutalism UI that works seamlessly on all devices
- **Real-time Updates**: Automatic updates when expenses are added, modified, or deleted

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives with custom Neobrutalism styling
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose 8.19.3
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Zod

### Development Tools
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Turbopack**: Fast bundling

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-coding-dl-mz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   Example:
   ```env
   MONGODB_URI=mongodb://localhost:27017/everydollar
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🗺️ Routes

### Frontend Routes (Pages)

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page - Expense management dashboard | Protected (requires auth) |
| `/visuals` | Expense visualizations and analytics | Protected (requires auth) |

**Note**: The home page (`/`) shows the authentication form if the user is not logged in, and the expense management dashboard if authenticated.

### API Routes

#### Authentication
- `POST /api/auth/signup` - User registration
  - Body: `{ name: string, email: string, password: string }`
  - Returns: User data with JWT token

- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: User data with JWT token

#### Expenses
- `GET /api/expenses` - Fetch all expenses for authenticated user
  - Query params (optional): `category`, `startDate`, `endDate`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of expenses

- `POST /api/expenses` - Create a new expense
  - Body: `{ title: string, category: string, amount: number, date: string }`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Created expense

- `GET /api/expenses/[id]` - Fetch a single expense
  - Headers: `Authorization: Bearer <token>`
  - Returns: Expense object

- `PUT /api/expenses/[id]` - Update an expense
  - Body: `{ title?: string, category?: string, amount?: number, date?: string }`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Updated expense

- `DELETE /api/expenses/[id]` - Delete an expense
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

#### Budget
- `GET /api/budget` - Fetch current month's budget
  - Headers: `Authorization: Bearer <token>`
  - Returns: Budget object or null

- `POST /api/budget` - Create or update monthly budget
  - Body: `{ amount: number }`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Budget object

## 🎨 Features

### Expense Management
- ✅ Add expenses with title, category, amount, and date
- ✅ Edit existing expenses
- ✅ Delete expenses
- ✅ Filter by category (Food, Transport, Shopping, Bills, Entertainment, Healthcare, Education, Travel, Other)
- ✅ Filter by month
- ✅ View expenses in table (desktop) or card (mobile) format
- ✅ Real-time expense updates

### Budget Tracker
- ✅ Set monthly spending budget
- ✅ Visual progress bar showing spending vs budget
- ✅ Color-coded indicators (green/orange/red)
- ✅ Warning state when budget is exceeded
- ✅ Real-time budget calculations
- ✅ Remaining budget display

### Data Visualization
- ✅ Pie chart: Spending distribution by category
- ✅ Bar chart: Monthly spending trends
- ✅ Summary cards: Total expenses, categories count, average expense
- ✅ Filterable expense table

### User Experience
- ✅ Neobrutalism design with bold borders and shadows
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user feedback
- ✅ Protected routes with authentication
- ✅ Persistent login with localStorage

## 📁 Project Structure

```
live-coding-dl-mz/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── budget/         # Budget endpoints
│   │   │   └── expenses/       # Expense endpoints
│   │   ├── visuals/            # Visualizations page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   ├── layout/             # Layout components (Navbar)
│   │   ├── modules/
│   │   │   ├── budget/         # Budget tracker component
│   │   │   ├── expense/        # Expense management components
│   │   │   ├── home/           # Home page components
│   │   │   └── visuals/        # Visualization components
│   │   ├── providers/         # Context providers
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/               # React Context providers
│   │   ├── AuthContext.tsx     # Authentication context
│   │   └── ExpenseContext.tsx  # Expense management context
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Auth middleware
│   │   ├── auth-client.ts      # Client-side auth utilities
│   │   ├── jwt.ts              # JWT utilities
│   │   └── monogdb.ts          # MongoDB connection
│   ├── models/                 # Mongoose models
│   │   ├── User.ts             # User model
│   │   ├── Expense.ts          # Expense model
│   │   └── Budget.ts           # Budget model
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Shared types
├── .env.local                  # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in `localStorage` and sent with each API request in the `Authorization` header.

**Token Format**: `Bearer <token>`

## 🎨 Design System

The application uses a **Neobrutalism** design aesthetic featuring:
- Bold 4px black borders
- Sharp corners (no rounded edges)
- High contrast colors
- Shadow effects for depth
- Bold typography
- Dynamic color system via CSS variables

**Color Variables** (customizable in `globals.css`):
- `--neo-border`: Border color for neobrutalism elements
- `--shadow-color`: Shadow color for depth effects
- `--primary`: Primary brand color (cyan)

## 🚀 Deployment

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Render**

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

This project is private and proprietary.

## 👨‍💻 Built By

**Developer**: Mahfuz Zayn
**Date**: 2025

---

**Note**: Remember to update the live site URL and add your MongoDB connection string in the `.env` file before running the application.
