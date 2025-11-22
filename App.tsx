import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ReferralStructure } from './components/ReferralStructure';
import { AdminPanel } from './components/AdminPanel';
import { WalletView } from './components/WalletView';
import { SimpleAuth } from './components/SimpleAuth';
import { TeamView } from './components/TeamView';
import { ProfileView } from './components/ProfileView';
import { ViewState, User } from './types';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Listen to user data ONLY when userId is set (logged in)
  useEffect(() => {
    if (!userId) {
        setUser(null);
        setInitialLoad(false);
        return;
    }

    setLoading(true);
    const userRef = ref(db, 'users/' + userId);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUser(data);
      } else {
        // Only reset if we actually had a userId but data was missing
        // This prevents loops if data is just taking a moment
        console.warn("User data not found for ID:", userId);
        setUser(null);
        setUserId(null);
      }
      setLoading(false);
      setInitialLoad(false);
    }, (error) => {
      console.error("DB Error:", error);
      setLoading(false);
      setInitialLoad(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleLogin = (uid: string) => {
    setLoading(true); // Set loading immediately to prevent UI flash
    setUserId(uid);
  };

  const handleLogout = () => {
    setUserId(null);
    setUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleAdminLogin = () => {
    setCurrentView(ViewState.ADMIN);
  };

  // 1. Initial loading (App start)
  // 2. Transition loading (Login pressed)
  if (loading || (userId && !user)) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <Loader2 className="animate-spin text-violet-600 mx-auto mb-2" size={40} />
                <p className="text-slate-400 text-sm font-medium">Loading Max Power...</p>
              </div>
          </div>
      );
  }

  // If not logged in, show Simple Password Auth
  if (!userId || !user) {
    return <SimpleAuth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeView user={user} onLogout={handleLogout} onNavigate={setCurrentView} />;
      case ViewState.WALLET:
        return <WalletView user={user} onAdminLogin={handleAdminLogin} />;
      case ViewState.STRUCTURE:
        return <ReferralStructure />;
      case ViewState.REFERRALS:
        return <TeamView currentUser={user} />;
      case ViewState.PROFILE:
        return <ProfileView user={user} />;
      case ViewState.ADMIN:
        return <AdminPanel onExit={() => setCurrentView(ViewState.HOME)} />;
      default:
        return <HomeView user={user} onLogout={handleLogout} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans antialiased flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col">
        
        {currentView !== ViewState.ADMIN && (
             <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0"></div>
        )}
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto relative z-10 no-scrollbar scroll-smooth">
           <div className="p-6 pb-32"> {/* Extra padding bottom for nav */}
             {renderContent()}
           </div>
        </main>

        {/* Navigation Fixed at Bottom within Container */}
        {currentView !== ViewState.ADMIN && (
            <BottomNav currentView={currentView} onChangeView={setCurrentView} />
        )}
      </div>
    </div>
  );
}