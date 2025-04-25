
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  fee: number;
  city: string;
  clinic: string;
  consultationType: string;
  profilePic: string;
  address: string;
  about: string;
  services: string[];
}

export interface FilterState {
  consultationType: string | null;
  specialties: string[];
  sortBy: string | null;
  searchTerm: string;
}

export interface AutocompleteState {
  isOpen: boolean;
  suggestions: string[];
  highlightedIndex: number;
}
