import { useState, useEffect } from "react";
import { seedCards as seedSupabaseCards } from "../lib/creditCardApi";
import { useAuth } from "../contexts/AuthContext";
import HomePage from "./HomePage";
import SummaryPage from "./SummaryPage";
import RecommendationsPage from "./RecommendationsPage";
import SpendingSimulator from "./SpendingSimulator";
import CompareCardsPage from "./CompareCardsPage";
import AllCardsPage from "./AllCardsPage";
import AdminInterface from "./AdminInterface";
import QuestionnaireFlow from "./QuestionnaireFlow";
import AdminLoginModal from "./AdminLoginModal";

type Page = "home" | "summary" | "recommendations" | "calculator" | "compare" | "all-cards" | "chat" | "admin";

export default function CreditCardApp() {
  const { isAdmin, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [compareCardIds, setCompareCardIds] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // URL-based routing functions
  const getPageFromURL = (): Page => {
    const hash = window.location.hash.slice(1) || "home";
    const validPages = ["home", "summary", "recommendations", "calculator", "compare", "all-cards", "chat", "admin"];
    return validPages.includes(hash) ? hash as Page : "home";
  };

  const navigateToPage = (page: Page, cardIds?: string[]) => {
    // Update URL
    window.history.pushState({ page, cardIds }, '', `#${page}`);
    
    // Update state
    setCurrentPage(page);
    if (cardIds) {
      setCompareCardIds(cardIds);
    }
    setShowMobileMenu(false);
  };

  // Initialize page from URL on load
  useEffect(() => {
    const initialPage = getPageFromURL();
    setCurrentPage(initialPage);
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = getPageFromURL();
      setCurrentPage(page);
      
      // Restore card IDs if available
      if (event.state && event.state.cardIds) {
        setCompareCardIds(event.state.cardIds);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Seed cards on first load (Supabase)
  useEffect(() => {
    (async () => {
      try {
        await seedSupabaseCards();
      } catch (err) {
        console.error('Error seeding cards:', err);
      }
    })();
  }, []);

  // Handle admin page navigation
  useEffect(() => {
    const handleAdminPageAccess = () => {
      const isAdminPage = window.location.hash === '#admin' || window.location.search.includes('admin=true');
      if (isAdminPage && !isAdmin) {
        setShowLoginModal(true);
      }
    };

    handleAdminPageAccess();
  }, [isAdmin]);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [showMobileMenu]);

  const handleNavigateWithCards = (page: Page, cardIds?: string[]) => {
    navigateToPage(page, cardIds);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigateToPage} />;
      case "summary":
        return <SummaryPage onNavigate={navigateToPage} />;
      case "recommendations":
        return <RecommendationsPage onNavigate={navigateToPage} onCompareCards={handleNavigateWithCards} />;
      case "calculator":
        return <SpendingSimulator onNavigate={navigateToPage} />;
      case "compare":
        return <CompareCardsPage onNavigate={navigateToPage} selectedCardIds={compareCardIds} />;
      case "all-cards":
        return <AllCardsPage onNavigate={navigateToPage} onCompareCards={handleNavigateWithCards} />;
      case "chat":
        return (
          <QuestionnaireFlow 
            onComplete={(responses: any) => {
              console.log('Questionnaire responses:', responses);
              navigateToPage('recommendations');
            }}
            onNavigate={(page: string) => navigateToPage(page as Page)}
            openChatDirectly={true}
          />
        );
      case "admin":
        if (!isAdmin) {
          setShowLoginModal(true);
          return <HomePage onNavigate={navigateToPage} />;
        }
        return <AdminInterface />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  const handleLoginSuccess = () => {
    navigateToPage('admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors relative">
      <AdminLoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <nav className="bg-background-card border-b border-border-light sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigateToPage("home")}
              className="flex items-center group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">credit_card</span>
                </div>
                <span className="text-2xl font-bold text-text-primary">
                  CreditWise AI
                </span>
              </div>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateToPage("home")}
                className={`text-text-secondary hover:text-primary transition-colors font-medium ${
                  currentPage === 'home' ? 'text-primary font-semibold' : ''
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateToPage("calculator")}
                className={`text-text-secondary hover:text-primary transition-colors font-medium ${
                  currentPage === 'calculator' ? 'text-primary font-semibold' : ''
                }`}
              >
                Rewards Calculator
              </button>
              <button 
                onClick={() => navigateToPage("all-cards")}
                className={`text-text-secondary hover:text-primary transition-colors font-medium ${
                  currentPage === 'all-cards' ? 'text-primary font-semibold' : ''
                }`}
              >
                All Cards
              </button>
              <button 
                onClick={() => navigateToPage("compare")}
                className={`text-text-secondary hover:text-primary transition-colors font-medium ${
                  currentPage === 'compare' ? 'text-primary font-semibold' : ''
                }`}
              >
                Compare Cards
              </button>
              {isAdmin && (
                <button 
                  onClick={() => navigateToPage("admin")}
                  className={`text-text-secondary hover:text-primary transition-colors font-medium ${
                    currentPage === 'admin' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  Admin
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={signOut}
                  className="text-text-secondary hover:text-red-500 transition-colors font-medium"
                >
                  Sign Out
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-background transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showMobileMenu ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
          {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden mobile-menu-overlay"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="
            fixed top-16 left-0 right-0 z-50 md:hidden
            bg-background-card border-b border-border-light shadow-times-lg
            mobile-menu-panel mobile-menu-enter
          ">
            <div className="p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <button 
                  onClick={() => navigateToPage("home")}
                className={`
                  flex items-center w-full text-left px-4 py-3 
                  text-text-secondary hover:text-primary hover:bg-background 
                  font-medium rounded-lg mobile-menu-item
                  ${currentPage === 'home' ? 'text-primary bg-background font-semibold shadow-times' : ''}
                `}
                >
                  <span className="material-symbols-outlined mr-3 text-sm">home</span>
                  Home
                </button>
                <button 
                  onClick={() => navigateToPage("calculator")}
                className={`
                  flex items-center w-full text-left px-4 py-3 
                  text-text-secondary hover:text-primary hover:bg-background 
                  font-medium rounded-lg mobile-menu-item
                  ${currentPage === 'calculator' ? 'text-primary bg-background font-semibold shadow-times' : ''}
                `}
                >
                  <span className="material-symbols-outlined mr-3 text-sm">calculate</span>
                  Rewards Calculator
                </button>
                <button 
                  onClick={() => navigateToPage("all-cards")}
                className={`
                  flex items-center w-full text-left px-4 py-3 
                  text-text-secondary hover:text-primary hover:bg-background 
                  font-medium rounded-lg mobile-menu-item
                  ${currentPage === 'all-cards' ? 'text-primary bg-background font-semibold shadow-times' : ''}
                `}
                >
                  <span className="material-symbols-outlined mr-3 text-sm">view_module</span>
                  All Cards
                </button>
                <button 
                  onClick={() => navigateToPage("compare")}
                className={`
                  flex items-center w-full text-left px-4 py-3 
                  text-text-secondary hover:text-primary hover:bg-background 
                  font-medium rounded-lg mobile-menu-item
                  ${currentPage === 'compare' ? 'text-primary bg-background font-semibold shadow-times' : ''}
                `}
                >
                  <span className="material-symbols-outlined mr-3 text-sm">compare</span>
                  Compare Cards
                </button>

                {isAdmin && (
                  <button 
                    onClick={() => navigateToPage("admin")}
                  className={`
                    flex items-center w-full text-left px-4 py-3 
                    text-text-secondary hover:text-primary hover:bg-background 
                    font-medium rounded-lg mobile-menu-item
                    ${currentPage === 'admin' ? 'text-primary bg-background font-semibold shadow-times' : ''}
                  `}
                  >
                    <span className="material-symbols-outlined mr-3 text-sm">admin_panel_settings</span>
                    Admin Dashboard
                  </button>
                )}

                {isAdmin && (
                  <button 
                    onClick={signOut}
                  className="
                    flex items-center w-full text-left px-4 py-3 
                    text-text-secondary hover:text-red-500 hover:bg-background 
                    font-medium rounded-lg mobile-menu-item
                  "
                  >
                    <span className="material-symbols-outlined mr-3 text-sm">logout</span>
                    Sign Out
                  </button>
                )}
              

            </div>
          </div>
        </>
          )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
}
