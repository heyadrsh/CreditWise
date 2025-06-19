import React from 'react';

type Page = "home" | "summary" | "recommendations" | "calculator" | "compare" | "all-cards" | "chat";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {

  return (
    <div className="min-h-screen bg-background font-times">
      {/* Times Internet Hero Section - Mobile First */}
      <div className="times-hero-bg text-white">
        <div className="
          max-w-7xl mx-auto 
          px-4 py-12
          sm:px-6 
          lg:px-8 lg:py-20
        ">
          <div className="text-center">
            <div className="mb-6 lg:mb-8">
              <div className="
                inline-flex items-center justify-center 
                w-16 h-16 
                lg:w-20 lg:h-20 
                bg-white/20 backdrop-blur-sm rounded-lg 
                mb-4 lg:mb-6 
                shadow-times-lg
              ">
                <span className="
                  material-symbols-outlined 
                  text-3xl lg:text-4xl 
                  text-white
                ">credit_card</span>
              </div>
            </div>
            <h1 className="
              text-3xl leading-tight
              sm:text-4xl 
              md:text-5xl md:leading-tight
              lg:text-5xl lg:leading-tight
              xl:text-6xl 
              font-bold 
              mb-4 lg:mb-6 
              font-times
            ">
              Find Your Perfect
              <span className="block text-primary-300">
                Credit Card
              </span>
            </h1>
            <p className="
              text-base leading-relaxed
              sm:text-lg 
              lg:text-xl lg:leading-relaxed
              mb-6 lg:mb-8 
              text-primary-100 
              max-w-2xl lg:max-w-3xl 
              mx-auto 
              font-times
              px-2 sm:px-0
            ">
              Get personalized credit card recommendations powered by AI. Analyze your spending habits, 
              compare benefits, and discover cards that maximize your rewards.
            </p>
            <div className="
              flex flex-col gap-3
              sm:gap-4 sm:flex-row sm:justify-center
              px-4 sm:px-0
            ">
              <button
                onClick={() => onNavigate('chat')}
                className="
                  inline-flex items-center justify-center
                  px-6 py-3
                  sm:px-8 sm:py-4
                  bg-white text-primary 
                  hover:bg-background-secondary hover:text-primary-dark 
                  font-semibold rounded-lg 
                  transition-all duration-300 
                  text-base sm:text-lg
                  shadow-times-lg hover:shadow-times-corporate 
                  font-times
                  w-full sm:w-auto
                "
              >
                <span className="material-symbols-outlined mr-2 sm:mr-3 text-xl sm:text-base">psychology</span>
                <span className="hidden sm:inline">Get AI Recommendations</span>
                <span className="sm:hidden">Get Recommendations</span>
              </button>
              <button
                onClick={() => onNavigate('calculator')}
                className="
                  inline-flex items-center justify-center
                  px-6 py-3
                  sm:px-8 sm:py-4
                  bg-transparent border-2 border-white 
                  text-white hover:bg-white hover:text-primary 
                  font-semibold rounded-lg 
                  transition-all duration-300 
                  text-base sm:text-lg
                  font-times
                  w-full sm:w-auto
                "
              >
                <span className="material-symbols-outlined mr-2 sm:mr-3 text-xl sm:text-base">calculate</span>
                Try Rewards Calculator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Times Internet Features Section - Mobile First */}
      <div className="
        py-12
        lg:py-20 
        times-corporate-bg
      ">
        <div className="
          max-w-7xl mx-auto 
          px-4
          sm:px-6 
          lg:px-8
        ">
          <div className="
            text-center 
            mb-8 lg:mb-16
          ">
            <h2 className="
              text-2xl leading-tight
              sm:text-3xl 
              md:text-4xl md:leading-tight
              lg:text-4xl lg:leading-tight
              xl:text-5xl 
              font-bold text-text-primary 
              mb-4 lg:mb-6 
              font-times
            ">
              Why Choose CreditWise AI?
            </h2>
            <div className="w-16 lg:w-24 h-1 bg-primary mx-auto mb-4 lg:mb-6"></div>
            <p className="
              text-base leading-relaxed
              sm:text-lg 
              lg:text-xl lg:leading-relaxed
              text-text-secondary 
              max-w-2xl lg:max-w-3xl 
              mx-auto font-times
              px-2 sm:px-0
            ">
              Our advanced AI technology makes finding the right credit card simple and personalized
            </p>
          </div>

          <div className="
            grid gap-6
            md:grid-cols-3 md:gap-8
          ">
            <div className="
              bg-background-card rounded-lg 
              p-6 lg:p-8 
              text-center border border-border 
              shadow-times-md hover:shadow-times-lg 
              transition-all duration-300 times-card-hover
            ">
              <div className="
                w-12 h-12
                lg:w-16 lg:h-16 
                bg-primary rounded-lg 
                flex items-center justify-center 
                mx-auto 
                mb-4 lg:mb-6 
                shadow-times
              ">
                <span className="
                  material-symbols-outlined text-white 
                  text-xl lg:text-2xl
                ">smart_toy</span>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">AI-Powered Matching</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Our intelligent algorithm analyzes your spending patterns and preferences to recommend the most suitable cards
              </p>
            </div>

            <div className="
              bg-background-card rounded-lg 
              p-6 lg:p-8 
              text-center border border-border 
              shadow-times-md hover:shadow-times-lg 
              transition-all duration-300 times-card-hover
            ">
              <div className="
                w-12 h-12
                lg:w-16 lg:h-16 
                bg-times-blue-600 rounded-lg 
                flex items-center justify-center 
                mx-auto 
                mb-4 lg:mb-6 
                shadow-times
              ">
                <span className="
                  material-symbols-outlined text-white 
                  text-xl lg:text-2xl
                ">calculate</span>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">Rewards Calculator</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Adjust your spending and see how different cards perform with real calculations
              </p>
            </div>

            <div className="
              bg-background-card rounded-lg 
              p-6 lg:p-8 
              text-center border border-border 
              shadow-times-md hover:shadow-times-lg 
              transition-all duration-300 times-card-hover
            ">
              <div className="
                w-12 h-12
                lg:w-16 lg:h-16 
                bg-times-blue-700 rounded-lg 
                flex items-center justify-center 
                mx-auto 
                mb-4 lg:mb-6 
                shadow-times
              ">
                <span className="
                  material-symbols-outlined text-white 
                  text-xl lg:text-2xl
                ">compare</span>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">Side-by-Side Comparison</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Compare up to 3 cards at once with detailed breakdowns of fees, rewards, and benefits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Times Internet How It Works Section - Mobile First */}
      <div className="
        bg-background-secondary 
        py-12 lg:py-20
      ">
        <div className="
          max-w-7xl mx-auto 
          px-4
          sm:px-6 
          lg:px-8
        ">
          <div className="
            text-center 
            mb-8 lg:mb-16
          ">
            <h2 className="
              text-2xl leading-tight
              sm:text-3xl 
              md:text-4xl md:leading-tight
              lg:text-4xl lg:leading-tight
              xl:text-5xl 
              font-bold text-text-primary 
              mb-4 lg:mb-6 
              font-times
            ">
              How It Works
            </h2>
            <div className="w-16 lg:w-24 h-1 bg-primary mx-auto mb-4 lg:mb-6"></div>
            <p className="
              text-base leading-relaxed
              sm:text-lg 
              lg:text-xl 
              text-text-secondary 
              max-w-xl lg:max-w-2xl 
              mx-auto font-times
              px-2 sm:px-0
            ">
              Get personalized recommendations in just 3 simple steps
            </p>
          </div>

          <div className="
            grid gap-8
            md:grid-cols-3 md:gap-8
          ">
            <div className="text-center">
              <div className="
                relative 
                mb-6 lg:mb-8
              ">
                <div className="
                  w-16 h-16
                  lg:w-20 lg:h-20 
                  bg-primary text-white rounded-full 
                  flex items-center justify-center 
                  mx-auto 
                  text-xl lg:text-2xl 
                  font-bold shadow-times-lg
                ">
                  1
                </div>
                <div className="absolute top-8 lg:top-10 left-1/2 transform -translate-x-1/2 w-px h-8 lg:h-12 bg-border hidden md:block"></div>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">Share Your Profile</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Tell us about your income, spending habits, and card preferences through our quick questionnaire or AI chat
              </p>
            </div>

            <div className="text-center">
              <div className="
                relative 
                mb-6 lg:mb-8
              ">
                <div className="
                  w-16 h-16
                  lg:w-20 lg:h-20 
                  bg-times-blue-600 text-white rounded-full 
                  flex items-center justify-center 
                  mx-auto 
                  text-xl lg:text-2xl 
                  font-bold shadow-times-lg
                ">
                  2
                </div>
                <div className="absolute top-8 lg:top-10 left-1/2 transform -translate-x-1/2 w-px h-8 lg:h-12 bg-border hidden md:block"></div>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">AI Analysis</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Our AI analyzes your profile against hundreds of credit cards to find the best matches for your needs
              </p>
            </div>

            <div className="text-center">
              <div className="
                relative 
                mb-6 lg:mb-8
              ">
                <div className="
                  w-16 h-16
                  lg:w-20 lg:h-20 
                  bg-times-blue-700 text-white rounded-full 
                  flex items-center justify-center 
                  mx-auto 
                  text-xl lg:text-2xl 
                  font-bold shadow-times-lg
                ">
                  3
                </div>
              </div>
              <h3 className="
                text-lg lg:text-xl 
                font-semibold 
                mb-3 lg:mb-4 
                text-text-primary font-times
              ">Get Recommendations</h3>
              <p className="
                text-sm lg:text-base
                text-text-secondary leading-relaxed font-times
              ">
                Receive personalized card recommendations with detailed explanations of why each card suits you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Times Internet CTA Section - Mobile First */}
      <div className="
        times-hero-bg text-white 
        py-12 lg:py-16
      ">
        <div className="
          max-w-3xl lg:max-w-4xl 
          mx-auto text-center 
          px-4
          sm:px-6 
          lg:px-8
        ">
          <div className="
            mb-6 lg:mb-8
          ">
            <div className="
              inline-flex items-center justify-center 
              w-16 h-16
              lg:w-20 lg:h-20 
              bg-white/20 backdrop-blur-sm rounded-full 
              mb-4 lg:mb-6 
              shadow-times-lg
            ">
              <span className="
                material-symbols-outlined 
                text-2xl lg:text-3xl
              ">rocket_launch</span>
            </div>
          </div>
          <h2 className="
            text-2xl leading-tight
            sm:text-3xl 
            md:text-4xl md:leading-tight
            lg:text-4xl lg:leading-tight
            xl:text-5xl 
            font-bold 
            mb-4 lg:mb-6 
            font-times
          ">
            Ready to Find Your Perfect Credit Card?
          </h2>
          <p className="
            text-base leading-relaxed
            sm:text-lg 
            lg:text-xl lg:leading-relaxed
            mb-6 lg:mb-8 
            text-primary-100 
            max-w-xl lg:max-w-2xl 
            mx-auto font-times
            px-2 sm:px-0
          ">
            Join thousands of users who have found their ideal credit cards with CreditWise AI
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="
              inline-flex items-center justify-center
              px-6 py-3
              sm:px-8 sm:py-4
              bg-white text-primary 
              hover:bg-background-secondary hover:text-primary-dark 
              font-semibold rounded-lg 
              transition-all duration-300 
              text-base sm:text-lg
              shadow-times-lg hover:shadow-times-corporate 
              font-times
              w-full max-w-xs
              sm:w-auto sm:max-w-none
            "
          >
            <span className="material-symbols-outlined mr-2 sm:mr-3 text-xl sm:text-base">rocket_launch</span>
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}
