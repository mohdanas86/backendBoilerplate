# EventFinder - Event Management Application

A full-stack event management application built with React (frontend) and Node.js/Express (backend).

## 🚀 Features

- **Event List View**: Browse all events with search and filtering
- **Event Detail View**: View complete event information
- **Create Event Form**: Add new events with validation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live participant tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Headless UI** for accessible components

### Backend
- **Node.js** with Express
- **MongoDB Atlas** database
- **Mongoose** ODM
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (already configured)

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend will start on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📖 API Endpoints

### Events API (`/api/events`)

- **GET** `/api/events` - Get all events (with optional location filter)
  - Query: `?location=string` (optional)
- **POST** `/api/events` - Create a new event
- **GET** `/api/events/:id` - Get event by ID

### Health Check
- **GET** `/api/health` - Server health check

## 🧪 Testing the Application

1. **Open your browser** and go to `http://localhost:5173`
2. **Check backend connectivity** by opening browser console and running:
   ```javascript
   fetch('http://localhost:8080/api/health').then(r => r.json()).then(console.log)
   ```
3. **Create a test event** using the "Create Event" button
4. **Browse events** on the main page
5. **Search by location** using the search bar

## 📁 Project Structure

```
eventFinder/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── middlewares/    # Express middlewares
│   │   └── db/             # Database connection
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helper functions
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb+srv://anas:anas@food.t6wubmw.mongodb.net
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🐛 Troubleshooting

### "Unexpected token '<', DOCTYPE..." Error
- This means the frontend is receiving HTML instead of JSON
- **Solution**: Make sure the backend is running on port 8080
- Check: `http://localhost:8080/api/health`

### Tailwind CSS Not Working
- Make sure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` configuration
- Restart the dev server after config changes

### CORS Errors
- Backend is configured to allow `http://localhost:5173`
- If using different ports, update CORS_ORIGIN in `.env`

### Database Connection Issues
- MongoDB Atlas credentials are pre-configured
- Check network connectivity
- Verify MongoDB Atlas cluster is running

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px (single column layout)
- **Tablet**: 640px - 1024px (two column layout)  
- **Desktop**: > 1024px (three column layout)

## 🎨 Design System

- **Primary Color**: Blue (#2563eb)
- **Typography**: System fonts with proper hierarchy
- **Components**: Card-based design with consistent spacing
- **Icons**: Lucide React icon library
- **Animations**: Smooth transitions and hover effects

## 🔄 Development Workflow

1. **Backend changes**: Server auto-restarts with nodemon
2. **Frontend changes**: Hot module replacement with Vite
3. **Database**: Connected to persistent MongoDB Atlas cluster
4. **Debugging**: Browser dev tools + server logs

---

## 🚀 Quick Start Commands

```bash
# Terminal 1 - Start Backend
cd backend && npm start

# Terminal 2 - Start Frontend  
cd frontend && npm run dev

# Open browser to http://localhost:5173
```

**Happy coding! 🎉**