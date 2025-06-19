import { useState, useEffect } from "react";
import { getAllCards } from "../lib/creditCardApi";
import { CreditCard } from "../lib/database.types";
import CardTile from "./CardTile";
import CardDetailsModal from "./CardDetailsModal";

type Page = "home" | "summary" | "recommendations" | "simulator" | "compare" | "all-cards";

interface AllCardsPageProps {
  onNavigate: (page: Page) => void;
  onCompareCards?: (page: Page, cardIds?: string[]) => void;
}

type SortOption = "name" | "reward_rate" | "annual_fee" | "min_income";
type FilterCategory = "all" | "entry level" | "mid-level" | "mid-premium" | "premium" | "super premium";
type FilterIssuer = "all" | "HDFC Bank" | "ICICI Bank" | "SBI Cards" | "Axis Bank" | "American Express" | "Kotak Mahindra Bank" | "Yes Bank" | "AU Small Finance Bank" | "HSBC Bank" | "RBL Bank" | "Federal Bank" | "IDFC FIRST Bank" | "IndusInd Bank";

export default function AllCardsPage({ onNavigate, onCompareCards }: AllCardsPageProps) {
  const [cards, setCards] = useState<CreditCard[] | null>(null);
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<CreditCard[]>([]);
  const [modalCard, setModalCard] = useState<CreditCard | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedIssuer, setSelectedIssuer] = useState<FilterIssuer>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(true);

  // Fetch cards on mount
  useEffect(() => {
    (async () => {
      const data = await getAllCards();
      if (Array.isArray(data)) {
        setCards(data as CreditCard[]);
        setFilteredCards(data as CreditCard[]);
      }
    })();
  }, []);

  // Filter and search cards
  useEffect(() => {
    if (!cards) return;

    let filtered = cards.filter((card: CreditCard) => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.network.toLowerCase().includes(searchTerm.toLowerCase());
      
      const cardCategory = (card.card_category || card.category).toLowerCase();
      const matchesCategory = selectedCategory === "all" || cardCategory === selectedCategory;
      
      const matchesIssuer = selectedIssuer === "all" || card.issuer === selectedIssuer;
      
      return matchesSearch && matchesCategory && matchesIssuer;
    });

    // Sort cards
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "reward_rate":
          aValue = a.base_reward_rate || a.reward_rate || 0;
          bValue = b.base_reward_rate || b.reward_rate || 0;
          break;
        case "annual_fee":
          aValue = a.annual_fee;
          bValue = b.annual_fee;
          break;
        case "min_income":
          aValue = a.min_income;
          bValue = b.min_income;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    });

    setFilteredCards(filtered);
  }, [cards, searchTerm, selectedCategory, selectedIssuer, sortBy, sortOrder]);

  const handleCardSelect = (cardId: string) => {
    const card = cards?.find((c: CreditCard) => c.id === cardId);
    if (!card) return;

    if (selectedCards.find(c => c.id === cardId)) {
      setSelectedCards(selectedCards.filter(c => c.id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleCardClick = (cardId: string) => {
    const card = cards?.find((c: CreditCard) => c.id === cardId);
    if (card) {
      setModalCard(card);
    }
  };

  const handleCompareSelected = () => {
    if (selectedCards.length >= 2 && onCompareCards) {
      onCompareCards("compare", selectedCards.map(c => c.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedIssuer("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  if (!cards) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-text-secondary">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Header */}
      <div className="bg-background-card">
        <div className="
          max-w-7xl mx-auto 
          px-4 py-4
          sm:px-6 sm:py-6 
          lg:px-8 lg:py-8
        ">
          <div className="
            flex flex-col gap-4
            lg:flex-row lg:items-center lg:justify-between lg:gap-6
          ">
            {/* Header Content - Mobile First */}
            <div className="flex-1">
              <div className="
                flex items-center gap-3
                sm:gap-4
                lg:mb-0
              ">
                <div className="
                  w-10 h-10
                  sm:w-12 sm:h-12 
                  lg:w-16 lg:h-16 
                  bg-primary rounded-lg 
                  sm:rounded-xl 
                  flex items-center justify-center shadow-lg
                ">
                  <span className="
                    material-symbols-outlined text-white 
                    text-xl
                    sm:text-2xl 
                    lg:text-3xl
                  ">credit_card</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="
                    text-xl font-bold text-text-primary
                    sm:text-2xl 
                    lg:text-4xl
                    leading-tight
                  ">
                    All Credit Cards
                  </h1>
                  <p className="
                    text-xs text-text-secondary
                    sm:text-sm 
                    lg:text-lg
                    leading-tight
                  ">
                    Explore our complete collection of {cards.length} credit cards
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-First Controls */}
            <div className="
              flex flex-row items-center gap-2 justify-end
              sm:gap-3
              lg:gap-6
            ">
              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                  lg:hidden 
                  flex items-center justify-center
                  w-10 h-10
                  sm:px-3 sm:py-2 sm:w-auto sm:h-auto
                  bg-background border border-border rounded-lg
                  text-text-secondary hover:text-primary hover:border-primary
                  transition-colors
                "
              >
                <span className="material-symbols-outlined text-lg sm:mr-2">filter_list</span>
                <span className="hidden sm:inline text-sm">Filter</span>
              </button>

              {/* Desktop Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                  hidden lg:flex items-center 
                  px-4 py-2 bg-background border border-border rounded-lg
                  text-text-secondary hover:text-primary hover:border-primary
                  transition-colors
                "
              >
                <span className="material-symbols-outlined mr-2">filter_list</span>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {/* Compare Button */}
              <button
                onClick={() => onNavigate("compare")}
                className="
                  flex items-center justify-center
                  w-10 h-10
                  sm:px-3 sm:py-2 sm:w-auto sm:h-auto
                  lg:px-4 lg:py-2
                  bg-primary hover:bg-primary-700 text-white rounded-lg 
                  transition-colors text-sm font-medium
                "
              >
                <span className="material-symbols-outlined text-lg sm:mr-2 lg:mr-2">compare</span>
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="
        max-w-7xl mx-auto 
        px-4 py-4
        sm:px-6 sm:py-6
        lg:px-8 lg:py-6
      ">
        <div className="
          flex flex-col gap-4
          lg:flex-row lg:gap-6
        ">
          {/* Mobile-First Sidebar Filters */}
          {showFilters && (
            <div className="
              order-1
              lg:order-none lg:w-80 xl:w-96
            ">
              <div className="
                bg-background-card rounded-lg border border-border
                p-4
                sm:p-5
                lg:p-6
              ">
                <div className="
                  flex items-center justify-between 
                  mb-4
                  lg:mb-6
                ">
                  <h3 className="
                    text-base font-semibold text-text-primary
                    lg:text-lg
                  ">
                    Search & Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="
                      text-xs text-text-secondary hover:text-primary
                      lg:text-sm
                      transition-colors
                    "
                  >
                    Clear All
                  </button>
                </div>

                {/* Search Bar */}
                <div className="
                  mb-4
                  lg:mb-6
                ">
                  <label className="
                    block text-xs font-medium text-text-primary mb-2
                    lg:text-sm
                  ">
                    Search Cards
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="
                        material-symbols-outlined text-text-secondary
                        text-lg
                        lg:text-xl
                      ">search</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by card name, bank, or network..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-2.5 
                        lg:py-3
                        bg-background border border-border rounded-lg
                        text-sm
                        lg:text-base
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-colors
                      "
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="
                  mb-4
                  lg:mb-6
                ">
                  <label className="
                    block text-xs font-medium text-text-primary mb-2
                    lg:text-sm
                  ">
                    Card Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as FilterCategory)}
                    className="
                      w-full px-3 py-2.5 bg-background border border-border rounded-lg
                      text-sm
                      lg:text-base
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                      transition-colors
                    "
                  >
                    <option value="all">All Categories</option>
                    <option value="entry level">Entry Level</option>
                    <option value="mid-level">Mid-Level</option>
                    <option value="mid-premium">Mid-Premium</option>
                    <option value="premium">Premium</option>
                    <option value="super premium">Super Premium</option>
                  </select>
                </div>

                {/* Issuer Filter */}
                <div className="
                  mb-4
                  lg:mb-6
                ">
                  <label className="
                    block text-xs font-medium text-text-primary mb-2
                    lg:text-sm
                  ">
                    Bank/Issuer
                  </label>
                  <select
                    value={selectedIssuer}
                    onChange={(e) => setSelectedIssuer(e.target.value as FilterIssuer)}
                    className="
                      w-full px-3 py-2.5 bg-background border border-border rounded-lg
                      text-sm
                      lg:text-base
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                      transition-colors
                    "
                  >
                    <option value="all">All Banks</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="SBI Cards">SBI Cards</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="American Express">American Express</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Yes Bank">Yes Bank</option>
                    <option value="AU Small Finance Bank">AU Small Finance Bank</option>
                    <option value="HSBC Bank">HSBC Bank</option>
                    <option value="RBL Bank">RBL Bank</option>
                    <option value="Federal Bank">Federal Bank</option>
                    <option value="IDFC FIRST Bank">IDFC FIRST Bank</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="
                  mb-4
                  lg:mb-6
                ">
                  <label className="
                    block text-xs font-medium text-text-primary mb-2
                    lg:text-sm
                  ">
                    Sort Options
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="
                        flex-1 px-3 py-2.5 bg-background border border-border rounded-lg
                        text-sm
                        lg:text-base
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-colors
                      "
                    >
                      <option value="name">Name</option>
                      <option value="reward_rate">Reward Rate</option>
                      <option value="annual_fee">Annual Fee</option>
                      <option value="min_income">Min Income</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="
                        px-3 py-2.5 bg-background border border-border rounded-lg
                        hover:border-primary hover:bg-primary/5
                        transition-colors
                      "
                      title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                    >
                      <span className="material-symbols-outlined text-text-secondary">
                        {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Results
                    </span>
                    <span className="text-text-primary">
                      {filteredCards.length} of {cards.length}
                    </span>
                  </div>
                  <div className="mt-2 bg-background">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(filteredCards.length / cards.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="
            flex-1 
            order-2
            lg:order-none
          ">
            {/* Mobile Quick Filters (Hidden when sidebar is open) */}
            {!showFilters && (
              <div className="
                lg:hidden mb-4
              ">
                <div className="
                  bg-background-card rounded-lg border border-border
                  p-4
                ">
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-text-secondary text-lg">search</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg
                        text-sm placeholder:text-text-light
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-colors
                      "
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Quick Filters Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as FilterCategory)}
                      className="
                        px-3 py-2 bg-background border border-border rounded-lg
                        text-sm
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-colors
                      "
                    >
                      <option value="all">All Categories</option>
                      <option value="entry level">Entry Level</option>
                      <option value="mid-level">Mid-Level</option>
                      <option value="mid-premium">Mid-Premium</option>
                      <option value="premium">Premium</option>
                      <option value="super premium">Super Premium</option>
                    </select>

                    <select
                      value={selectedIssuer}
                      onChange={(e) => setSelectedIssuer(e.target.value as FilterIssuer)}
                      className="
                        px-3 py-2 bg-background border border-border rounded-lg
                        text-sm
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                        transition-colors
                      "
                    >
                      <option value="all">All Banks</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="SBI Cards">SBI Cards</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="American Express">American Express</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="
                    mt-3 text-xs text-text-secondary
                    flex justify-between items-center
                  ">
                    <span>Showing {filteredCards.length} of {cards.length} cards</span>
                    <button
                      onClick={() => setShowFilters(true)}
                      className="text-primary hover:text-primary-700 font-medium"
                    >
                      More Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Compare Selected Cards Bar */}
            {selectedCards.length > 0 && (
              <div className="
                mb-4
                lg:mb-6
              ">
                <div className="
                  bg-background-card rounded-lg border border-border
                  p-4
                  lg:p-6
                ">
                  <div className="
                    flex flex-col gap-3
                    lg:flex-row lg:items-center lg:justify-between lg:gap-4
                  ">
                    <div className="flex items-center space-x-3">
                      <div className="
                        w-8 h-8 bg-primary rounded-full flex items-center justify-center
                        lg:w-10 lg:h-10
                      ">
                        <span className="
                          material-symbols-outlined text-white 
                          text-base
                          lg:text-lg
                        ">compare</span>
                      </div>
                      <div>
                        <p className="
                          font-semibold text-text-primary
                          text-sm
                          lg:text-base
                        ">
                          {selectedCards.length} cards selected for comparison
                        </p>
                        <p className="
                          text-xs text-text-secondary
                          lg:text-sm
                        ">
                          {selectedCards.length >= 2 ? "Ready to compare" : "Select one more to compare"}
                        </p>
                      </div>
                    </div>
                    <div className="
                      flex items-center space-x-2
                      lg:space-x-3
                    ">
                      <button
                        onClick={() => setSelectedCards([])}
                        className="
                          px-3 py-2 text-text-secondary hover:text-primary
                          text-sm
                          lg:px-4 lg:text-base
                          transition-colors
                        "
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleCompareSelected}
                        disabled={selectedCards.length < 2}
                        className="
                          px-4 py-2 bg-primary hover:bg-primary-700 
                          disabled:bg-gray-300 disabled:cursor-not-allowed 
                          text-white font-medium rounded-lg transition-colors
                          text-sm
                          lg:px-6 lg:text-base
                        "
                      >
                        Compare Cards
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-First Cards Grid */}
            <div className="
              grid gap-4
              grid-cols-1
              sm:grid-cols-2 sm:gap-5
              lg:grid-cols-2 lg:gap-6
              xl:grid-cols-3
            ">
              {filteredCards.map((card: CreditCard) => (
                <CardTile
                  key={card.id}
                  card={card}
                  onAddToCompare={handleCardSelect}
                  isSelected={selectedCards.some(c => c.id === card.id)}
                  showCompareButton={true}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredCards.length === 0 && (
              <div className="
                text-center 
                py-8
                lg:py-16
              ">
                <div className="
                  w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center
                  lg:w-20 lg:h-20
                ">
                  <span className="
                    material-symbols-outlined text-gray-400 
                    text-2xl
                    lg:text-3xl
                  ">search_off</span>
                </div>
                <h3 className="
                  text-lg font-semibold text-text-primary mb-2
                  lg:text-2xl lg:mb-4
                ">
                  No cards found
                </h3>
                <p className="
                  text-text-secondary mb-6 text-sm
                  lg:text-base lg:mb-8
                  max-w-md mx-auto
                ">
                  Try adjusting your search criteria or filters to find the cards you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="
                    px-6 py-3 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-colors
                    text-sm
                    lg:px-8 lg:text-base
                  "
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-First Bottom Navigation */}
        <div className="
          mt-8 text-center
          lg:mt-12
        ">
          <div className="
            flex flex-col gap-3
            sm:flex-row sm:gap-4 sm:justify-center
          ">
            <button
              onClick={() => onNavigate("home")}
              className="
                inline-flex items-center justify-center 
                px-6 py-3 border border-border rounded-lg
                text-text-secondary hover:text-primary hover:border-primary
                transition-colors text-sm font-medium
                lg:text-base
              "
            >
              <span className="material-symbols-outlined mr-2">home</span>
              Back to Home
            </button>
            <button
              onClick={() => onNavigate("recommendations")}
              className="
                inline-flex items-center justify-center 
                px-6 py-3 border border-primary text-primary 
                hover:bg-primary/10 font-semibold rounded-lg transition-colors
                text-sm
                lg:text-base
              "
            >
              <span className="material-symbols-outlined mr-2">lightbulb</span>
              Get AI Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalCard && (
        <CardDetailsModal 
          card={modalCard} 
          onClose={() => setModalCard(null)} 
        />
      )}
    </div>
  );
}
 

