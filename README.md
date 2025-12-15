# Study Habit Analyzer - AI-Powered Study Tracker

An AI-powered study tracker web application built with React.js, Tailwind CSS, Express, and MongoDB. Track your study sessions, view analytics, receive AI recommendations, and take AI-generated quizzes from uploaded study materials.

---

## 🚀 Live Demo

**Deployed Application:** https://ai-study-tracker.onrender.com/

---

## ✨ Features

### 🔐 User Authentication
- Login/signup system with secure session-based authentication
- User-specific data stored in MongoDB
- Session persistence across browser sessions
- User profile display with logout functionality

### 📚 Study Session Tracking
- Add, edit, delete sessions (subject, start/end time)
- Automatic duration calculation
- Responsive table (desktop) and card (mobile) views
- Study sessions saved in MongoDB for persistence

### 📊 Dashboard & Analytics
- Summary cards: total study time, current streak, total sessions
- Interactive charts with Recharts:
  - Bar chart: study time per subject
  - Pie chart: subject distribution
  - Line chart: weekly study patterns
- Highlights strong & weak subjects

### 🤖 AI Recommendations
- Personalized suggestions based on user study data
- Priority levels: High, Medium, Low
- Optimizes schedules, balances subjects, and improves consistency
- Recommendations stored per user in MongoDB

### ✏️ AI-Generated Quizzes
- Generate quizzes from uploaded PDFs, images, or text files
- AI parses content to create multiple-choice questions
- Quiz results with score, percentage, and explanations stored in MongoDB
- Retake quizzes and view history

### 🎨 UI & Design
- Modern purple/indigo theme with high contrast
- Tailwind CSS for responsive, mobile-first design
- Interactive UI with hover effects, smooth transitions, and toast notifications
- Lucide React icons and Recharts for data visualization

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js, MongoDB, pdf-parse
- **AI Services:** Quiz generation and study recommendations

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
````

2. **Install frontend dependencies:**

```bash
cd frontend
npm install
```

3. **Install backend dependencies:**

```bash
cd ../backend
npm install
```

4. **Configure environment variables** in `backend/.env`:

```ini
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>
AI_API_KEY=<your-AI-service-key>
```

5. **Start the backend server:**

```bash
cd backend
npm run start
```

6. **Start the frontend development server:**

```bash
cd ../frontend
npm run dev
```

* Open your browser at [http://localhost:5173](http://localhost:5173)
* Backend API runs on [http://localhost:3000](http://localhost:3000)

---

## 📝 How to Use

1. **Sign Up & Log In:** Create a new account and log in.
2. **Upload Study Materials:** Upload PDFs, images, or text files for AI-generated quizzes.
3. **Add Study Sessions:** Log subjects with start/end times to track study activity.
4. **View Dashboard:** Explore charts and summary cards for analytics.
5. **Get AI Recommendations:** Receive personalized suggestions for improving study habits.
6. **Take AI-Generated Quizzes:** Answer questions, submit, and view scores and explanations. Retake quizzes as needed.

---

## 💾 Data Persistence

* Users, study sessions, uploads, quizzes, quiz results, and AI recommendations are all stored in MongoDB.
* Data persists across sessions and devices, ensuring each user has their own personalized study data.