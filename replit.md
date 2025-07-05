# Fire Fight Tournament Platform

## Overview

Fire Fight is a competitive gaming tournament platform built for esports enthusiasts. The platform enables players to participate in tournaments for popular games like Free Fire, PUBG, Call of Duty, and other battle royale/FPS games. Players can create teams, join tournaments, manage their wallets, and compete for real prizes.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: JWT-based authentication (placeholder implementation)
- **API Design**: RESTful endpoints with JSON responses

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database abstraction layer
│   └── db.ts             # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── migrations/            # Database migration files
```

## Key Components

### Authentication System
- JWT-based authentication with local storage persistence
- Role-based access control (user/admin)
- Auth context provider for global state management
- Protected routes for admin panel

### Database Schema
- **Users**: Profile information, wallet balance, referral system
- **Games**: Supported games with categories and metadata
- **Tournaments**: Competition details, prizes, scheduling
- **Teams**: Team management with join codes and member tracking
- **Transactions**: Financial operations and wallet management
- **Notifications**: User communication system

### Frontend Components
- **Layout System**: Responsive navigation with mobile-first design
- **Game Cards**: Interactive game selection with visual feedback
- **Tournament Cards**: Tournament listings with status indicators
- **Team Management**: Team creation, joining, and member management
- **Wallet Interface**: Money management with transaction history
- **Admin Panel**: Complete tournament and user management system

### Key Features
- Real-time tournament updates
- Team-based gameplay support
- Wallet system with multiple payment methods
- Referral program with bonus rewards
- Comprehensive admin dashboard
- Mobile-responsive design

## Data Flow

### User Registration/Login
1. User submits credentials via form
2. Frontend validates input using Zod schemas
3. API endpoint processes authentication
4. JWT token stored in localStorage
5. User context updated across application

### Tournament Participation
1. User browses available tournaments
2. Selects tournament and clicks join
3. Modal validates wallet balance and team requirements
4. API creates tournament participant record
5. User receives confirmation and tournament details

### Team Management
1. User creates team with generated join code
2. Team members join using shared code
3. Captain manages team roster
4. Team participates in tournaments as unit

### Wallet Operations
1. User initiates add money request
2. Payment gateway integration (placeholder)
3. Transaction recorded in database
4. User balance updated
5. Transaction history maintained

## External Dependencies

### Frontend Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation integration
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: PostgreSQL driver
- **drizzle-zod**: Schema validation integration
- **ws**: WebSocket support for real-time features

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **@types/node**: Node.js type definitions
- **tsx**: TypeScript execution

## Deployment Strategy

### Build Process
1. **Development**: `npm run dev` - Runs both frontend and backend in development mode
2. **Production Build**: `npm run build` - Creates optimized frontend build and bundles backend
3. **Production Start**: `npm start` - Serves the application in production mode

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment identifier (development/production)
- **JWT_SECRET**: Token signing secret (to be implemented)

### Database Management
- **Schema Push**: `npm run db:push` - Pushes schema changes to database
- **Migrations**: Located in `/migrations` directory
- **Drizzle Kit**: Configuration in `drizzle.config.ts`

### Hosting Considerations
- Frontend: Static files served from `/dist/public`
- Backend: Express server handling API routes
- Database: PostgreSQL instance (Neon Database recommended)
- File uploads: Currently placeholder implementation

## Changelog

Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Database Migration Complete:
  * Migrated from in-memory storage to PostgreSQL database
  * Added database relations using Drizzle ORM relations
  * Populated comprehensive seed data:
    - 32 users (including admins and diverse international players)
    - 31 games across multiple categories (Battle Royale, MOBA, FPS, Fighting, Racing, Sports, Strategy, Card Games, Simulation, Puzzle)
    - 27 tournaments (live, upcoming, and completed with detailed scheduling)
    - 35 teams with realistic performance statistics and member compositions
    - 169 team member records with proper role assignments
    - 170 tournament participant records for realistic competition data
    - 67 comprehensive transaction records (deposits, withdrawals, tournament fees, winnings, referral bonuses)
    - 45 notification records covering all notification types (tournament, wallet, system, referral, team, achievement, event)
    - 92 tournament result records for completed tournaments with detailed statistics
  * All data includes realistic international diversity, skill levels, and platform activity

## User Preferences

Preferred communication style: Simple, everyday language.