# CreditWise AI - Agent-Powered Credit Card Recommendation System

A web-based, AI-powered credit card recommendation system that leverages Large Language Models to guide users through personalized conversations and suggest optimal credit card matches based on their financial profiles and preferences.

**Note: This is an early-stage prototype demonstrating core functionality. The system is under active development and requires significant improvements before production deployment.**

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Demo & Screenshots](#demo--screenshots)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Known Issues & Limitations](#known-issues--limitations)
- [Future Roadmap](#future-roadmap)

## Overview

CreditWise AI addresses the complexity of credit card selection in the Indian market by providing an intelligent, conversational interface that understands user needs and matches them with suitable financial products. The system combines natural language processing, advanced scoring algorithms, and comprehensive financial data to deliver personalized recommendations.

## Key Features

### 🤖 Conversational AI Agent
- **LLM-Powered Interface**: Built using Google Gemini AI for natural language understanding
- **Dynamic Questioning**: Adaptive conversation flow based on user responses  
- **Context Awareness**: Maintains conversation history and user profile throughout the session
- **Profile Extraction**: Automatically extracts key financial information from natural language

### 💳 Comprehensive Card Database
- **20+ Indian Credit Cards**: Curated dataset with major issuers (HDFC, SBI, ICICI, Axis, etc.)
- **Detailed Card Profiles**: Complete information including fees, rewards, eligibility, and perks
- **Real-time Data Management**: Admin interface for database updates and maintenance
- **Structured Data Model**: Normalized schema supporting complex queries and filtering

### 🎯 Intelligent Recommendation Engine
- **Multi-Factor Scoring**: Advanced algorithm considering income, spending patterns, and preferences
- **Personalized Ranking**: Top 3-5 card recommendations with detailed justification
- **Reward Simulation**: Projected annual earnings based on user spending patterns
- **Eligibility Filtering**: Automatic filtering based on income and credit requirements

### 💻 Professional Web Interface
- **Mobile-Responsive Design**: Optimized for all device types and screen sizes
- **Interactive Calculator**: Spending simulator with real-time reward calculations
- **Comparison Tools**: Side-by-side card comparison with detailed feature breakdown
- **Modern UI/UX**: Professional design following Times Internet corporate standards

### 🛡️ Administrative Dashboard
- **Full CRUD Operations**: Complete card database management capabilities
- **Real-time Synchronization**: Auto-refresh functionality for live data updates
- **Analytics Dashboard**: Card statistics and usage patterns
- **Secure Authentication**: Role-based access control with Supabase Auth

## Technology Stack

### Frontend
- **React 19** with TypeScript for type safety and modern development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** with custom corporate design system
- **Material Symbols** for consistent iconography

### Backend & Database
- **Supabase** as Backend-as-a-Service (PostgreSQL + Auth + Real-time)
- **RESTful API** design with comprehensive error handling
- **Real-time subscriptions** for live data updates

### AI & Machine Learning
- **Google Gemini AI** for natural language processing and conversation management
- **Custom scoring algorithms** for card recommendation and ranking
- **Context-aware dialogue** system with memory management

### Development & Deployment
- **TypeScript** for enhanced code quality and developer experience
- **ESLint & Prettier** for consistent code formatting
- **Vercel** for production deployment with CDN optimization

## Database Schema

![Database Overview](images/database_overview.png)
*Supabase database structure showing credit cards table*

### Credit Cards Table
```sql
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(100) NOT NULL,
  joining_fee INTEGER DEFAULT 0,
  annual_fee INTEGER DEFAULT 0,
  fee_currency VARCHAR(3) DEFAULT 'INR',
  fee_waiver_condition TEXT,
  reward_type VARCHAR(50),
  base_reward_rate DECIMAL(3,2),
  reward_details TEXT,
  min_income INTEGER,
  credit_score INTEGER,
  age_min INTEGER DEFAULT 21,
  age_max INTEGER DEFAULT 65,
  invite_only BOOLEAN DEFAULT FALSE,
  special_perks TEXT[],
  best_for TEXT[],
  card_category VARCHAR(50),
  network VARCHAR(50),
  apply_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Google AI Studio API key
- Git for version control

### Environment Configuration
```bash
# Clone the repository
git clone https://github.com/yourusername/creditwise-ai.git
cd creditwise-ai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_ai_api_key
```

### Database Setup
1. Create a new Supabase project
2. Run the provided SQL schema in the SQL editor
3. Configure Row Level Security policies
4. Seed the database with sample credit card data

### Development Server
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo & Screenshots

### Live Demo
**Deployed Application**: [https://creditwise-ai.vercel.app](https://creditwise-ai.vercel.app)

### Core Features Demonstration

#### 💬 AI-Powered Conversation & Recommendations
![AI Chat Demo](images/ai_recommendation.gif)
*Complete AI conversation from start to personalized recommendations*

#### 🖥️ Desktop Experience
![Desktop Overview](images/dekstop_overview.gif)
*Complete user journey and interface on desktop*

#### 📱 Mobile Experience
![Mobile Demo](images/mobile_overview.gif)
*Responsive design across different device sizes*

#### 🧮 Spending Calculator
![Calculator Demo](images/rewards_calculator.gif)
*Interactive spending simulator with real-time calculations*

#### 📊 Card Comparison & Browsing
![Comparison Demo](images/all_cards.gif)
*Side-by-side card comparison and browsing functionality*

#### ⚙️ Admin Interface
![Admin Panel](images/admin-panel.gif)
*Administrative dashboard for database management*

## API Documentation

### Core Endpoints
```typescript
// Get all credit cards
GET /api/cards

// Search cards with filters
GET /api/cards/search?category=premium&network=visa

// Get card recommendations
POST /api/recommendations
{
  "income": 500000,
  "spending_categories": ["dining", "travel"],
  "preferred_benefits": ["cashback"]
}

// Create new card (admin only)
POST /api/cards
Authorization: Bearer <admin_token>
```

### Response Formats
```typescript
interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annual_fee: number;
  reward_rate: number;
  // ... additional fields
}

interface Recommendation {
  card: CreditCard;
  score: number;
  reasons: string[];
  projected_rewards: number;
}
```

## Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Environment Setup
- Configure environment variables in Vercel dashboard
- Set up custom domain and SSL certificates
- Enable analytics and monitoring

### Performance Optimization
- Code splitting for faster loading
- CDN optimization for static assets
- Database query optimization
- Image compression and lazy loading

## Known Issues & Limitations

### Current Limitations
- **Data Scope**: Limited to 20+ sample credit cards (expandable)
- **AI Context**: Conversation memory limited to session duration
- **Real-time Updates**: Database changes require manual refresh in some cases
- **Mobile Optimization**: Some advanced features need mobile-specific improvements

### Performance Considerations
- **API Rate Limits**: Google Gemini AI has usage limitations
- **Database Scaling**: Current setup suitable for prototype-level traffic
- **Error Handling**: Some edge cases need additional validation

### Security Notes
- **Data Privacy**: User conversations not permanently stored
- **API Security**: Environment variables properly configured
- **Access Control**: Admin features protected with authentication

## Future Roadmap

### Phase 1: Core Improvements
- Enhanced AI conversation flow with better context management
- Expanded credit card database with more Indian financial institutions
- Improved mobile user experience and performance optimization
- Advanced analytics and user behavior tracking

### Phase 2: Feature Expansion
- WhatsApp integration using Twilio API for conversational commerce
- Machine learning models for improved recommendation accuracy
- Credit score integration with third-party services
- Advanced comparison tools with detailed feature analysis

### Phase 3: Production Readiness
- Comprehensive testing suite with automated QA
- Scalable infrastructure for high-traffic scenarios
- Enhanced security measures and compliance frameworks
- Integration with actual bank APIs for real-time card information

### Phase 4: Advanced Features
- Personalized financial advisory services
- Integration with expense tracking applications
- Automated application processing and status tracking
- Advanced analytics dashboard for business intelligence

---

**Note**: This prototype demonstrates the core concepts and functionality of an AI-powered credit card recommendation system. Significant development and testing are required before considering production deployment. The system serves as a proof-of-concept for AI agent integration in financial advisory services.