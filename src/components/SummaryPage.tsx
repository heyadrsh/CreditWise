type Page = "home" | "summary" | "recommendations" | "simulator" | "compare";

interface SummaryPageProps {
  onNavigate: (page: Page) => void;
}

export default function SummaryPage({ onNavigate }: SummaryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary">
            Your Credit Card Analysis
          </h1>
          <p className="text-xl text-text-secondary">
            Here's what we found based on your preferences and spending habits
          </p>
        </div>
        
        <div className="bg-background-card">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent-blue/10">
              <span className="material-symbols-outlined text-accent-blue">psychology</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary">We've crunched the numbers...</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Primary spending category:
                  </span>
                    <span className="font-semibold text-text-primary">Dining</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Monthly spend estimate:
                  </span>
                    <span className="font-semibold text-text-primary">₹35,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Preferred benefits:
                  </span>
                    <span className="font-semibold text-text-primary">Travel & Rewards</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Credit score range:
                  </span>
                    <span className="font-semibold text-text-primary">750+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("recommendations")}
              className="inline-flex items-center px-8 py-4 bg-primary"
            >
              <span className="material-symbols-outlined mr-2">lightbulb</span>
              View Recommendations
            </button>
            
            <button
              onClick={() => onNavigate("simulator")}
              className="inline-flex items-center px-8 py-4 border-2 border-primary"
            >
              <span className="material-symbols-outlined mr-2">calculate</span>
              Try Simulator
            </button>
          </div>
          
          <button
            onClick={() => onNavigate("home")}
            className="text-text-secondary"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

