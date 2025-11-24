import { useState, useEffect } from "react";
import { BookOpen, BarChart3, Lightbulb, FileQuestion, FileText, Target, Menu, X } from "lucide-react";
import StudySessionForm from "./components/StudySessionForm";
import StudySessionList from "./components/StudySessionList";
import Dashboard from "./components/Dashboard";
import Recommendations from "./components/Recommendations";
import Quiz from "./components/Quiz";
import Toast from "./components/Toast";
import AuthPage from "./components/AuthPage";
import UploadNotes from "./components/UploadNotes";
import { checkSession, logout } from "./api/auth";
import { StudyGoals } from "./components/StudyGoals";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "tracker", label: "Sessions", icon: BookOpen },
  { id: "studyGoals", label: "Goals", icon: Target },
  { id: "uploadNotes", label: "Upload Notes", icon: FileText },
  { id: "quiz", label: "Quiz", icon: FileQuestion },
  { id: "recommendations", label: "Insights", icon: Lightbulb },
];

const TabButton = ({ tab, active, onClick }) => {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      {tab.label}
    </button>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sessions, setSessions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, type = "success") => setToast({ show: true, message, type });

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) setSessions(await res.json());
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await checkSession();
        if (response.loggedIn && response.user) {
          setUser(response.user);
          await fetchSessions();
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const handleAuth = async (userData, isSignup) => {
    setUser(userData);
    showToast(`${isSignup ? "Welcome" : "Welcome back"}, ${userData.username} !`);
    setShowAuthPage(false);
    setActiveTab("dashboard");
    if (!isSignup) await fetchSessions();
    else setSessions([]);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await logout();
      setUser(null);
      setSessions([]);
      showToast("Logged out successfully");
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Logout failed", "error");
    }
  };

  const handleFeatureAccess = () => {
    if (!user) {
      showToast("Please login to use this feature", "error");
      return false;
    }
    return true;
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuthPage && !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <AuthPage
          onLogin={(u) => handleAuth(u, false)}
          onSignup={(u) => handleAuth(u, true)}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    );
  }

  const renderContent = () => {
    const contentMap = {
      dashboard: <Dashboard sessions={sessions} />,
      recommendations: <Recommendations sessions={sessions} showToast={showToast} />,
      quiz: <Quiz showToast={showToast} />,
      tracker: (
        <div className="space-y-6">
          <StudySessionForm
            onAddSession={(newSession) => {
              if (!handleFeatureAccess()) return;
              setSessions([newSession, ...sessions]);
              showToast("Session added!");
            }}
            isLoggedIn={!!user}
            showToast={showToast}
          />
          <StudySessionList
            sessions={sessions}
            onEditSession={(updatedSession) => {
              if (!handleFeatureAccess()) return;
              setSessions(
                sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))
              );
              showToast("Session updated!");
            }}
            onDeleteSession={(id) => {
              if (!handleFeatureAccess()) return;
              setSessions(sessions.filter((s) => s.id !== id));
              showToast("Session deleted!");
            }}
          />
        </div>
      ),
      uploadNotes: <UploadNotes showToast={showToast} />,
      studyGoals: <StudyGoals sessions={sessions} showToast={showToast} />,
    };
    return contentMap[activeTab];
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Study Tracker</h1>
            <p className="text-sm text-gray-500">AI-Powered Learning</p>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User Info & Login/Logout */}
        <div className="p-6 border-t border-gray-200">
          {user && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">{user.username}</p>
              <p className="text-xs text-blue-600">{user.email}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <div>
              Total Sessions: <span className="font-semibold">{sessions.length}</span>
            </div>
            <div>
              Time Studied: <span className="font-semibold">{totalHours}h</span>
            </div>
          </div>

          <button
            onClick={user ? handleLogout : () => setShowAuthPage(true)}
            className={`mt-4 w-full ${
              user ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 rounded-lg transition-all font-semibold`}
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">AI Study Tracker</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-64 pt-20 md:pt-8">{renderContent()}</main>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default App;
