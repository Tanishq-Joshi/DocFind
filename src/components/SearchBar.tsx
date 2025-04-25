
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { AutocompleteState } from "../types/doctor";

interface SearchBarProps {
  doctors: { id: number; name: string }[];
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ doctors, searchTerm, onSearch }) => {
  const [state, setState] = useState<AutocompleteState>({
    isOpen: false,
    suggestions: [],
    highlightedIndex: -1,
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setState(prev => ({ ...prev, suggestions: [], isOpen: false }));
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const matchedDoctors = doctors
      .filter(doctor => doctor.name.toLowerCase().includes(searchTermLower))
      .map(doctor => doctor.name);

    // Get unique names
    const uniqueNames = Array.from(new Set(matchedDoctors));
    
    // Limit to top 3 suggestions
    const topSuggestions = uniqueNames.slice(0, 3);

    setState(prev => ({
      ...prev,
      suggestions: topSuggestions,
      isOpen: topSuggestions.length > 0,
      highlightedIndex: -1,
    }));
  }, [searchTerm, doctors]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setState(prev => ({ ...prev, isOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        highlightedIndex: Math.min(prev.highlightedIndex + 1, prev.suggestions.length - 1),
        isOpen: true,
      }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        highlightedIndex: Math.max(prev.highlightedIndex - 1, 0),
        isOpen: true,
      }));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (state.highlightedIndex >= 0) {
        onSearch(state.suggestions[state.highlightedIndex]);
        setState(prev => ({ ...prev, isOpen: false }));
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearch(suggestion);
    setState(prev => ({ ...prev, isOpen: false }));
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search doctors by name..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-medical-500"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          data-testid="autocomplete-input"
        />
      </div>

      {state.isOpen && (
        <div ref={suggestionsRef} className="suggestion-container">
          {state.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`suggestion-item ${
                index === state.highlightedIndex ? "suggestion-item-highlighted" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid="suggestion-item"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
