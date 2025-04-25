
import React from "react";
import { FilterState } from "../types/doctor";

interface FilterPanelProps {
  filters: FilterState;
  allSpecialties: string[];
  updateFilters: (newFilters: Partial<FilterState>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  allSpecialties,
  updateFilters,
}) => {
  const handleConsultationTypeChange = (type: string) => {
    updateFilters({ consultationType: type });
  };

  const handleSpecialtyChange = (specialty: string, isChecked: boolean) => {
    let updatedSpecialties: string[];
    
    if (isChecked) {
      updatedSpecialties = [...filters.specialties, specialty];
    } else {
      updatedSpecialties = filters.specialties.filter(item => item !== specialty);
    }
    
    updateFilters({ specialties: updatedSpecialties });
  };

  const handleSortChange = (sortType: string) => {
    updateFilters({ sortBy: sortType });
  };

  return (
    <div className="filter-container">
      {/* Consultation Type Filter */}
      <div className="filter-section">
        <h3 className="filter-header" data-testid="filter-header-moc">Consultation Type</h3>
        <div className="space-y-2">
          <div className="filter-option">
            <input
              type="radio"
              id="video-consult"
              name="consultationType"
              className="mt-0.5"
              checked={filters.consultationType === "Video Consult"}
              onChange={() => handleConsultationTypeChange("Video Consult")}
              data-testid="filter-video-consult"
            />
            <label htmlFor="video-consult" className="ml-2 text-sm">
              Video Consult
            </label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="in-clinic"
              name="consultationType"
              className="mt-0.5"
              checked={filters.consultationType === "In Clinic"}
              onChange={() => handleConsultationTypeChange("In Clinic")}
              data-testid="filter-in-clinic"
            />
            <label htmlFor="in-clinic" className="ml-2 text-sm">
              In Clinic
            </label>
          </div>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 className="filter-header" data-testid="filter-header-speciality">Specialties</h3>
        <div className="space-y-2">
          {allSpecialties.map(specialty => (
            <div key={specialty} className="filter-option">
              <input
                type="checkbox"
                id={`specialty-${specialty}`}
                className="mt-0.5"
                checked={filters.specialties.includes(specialty)}
                onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                data-testid={`filter-specialty-${specialty}`}
              />
              <label htmlFor={`specialty-${specialty}`} className="ml-2 text-sm">
                {specialty}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="filter-section">
        <h3 className="filter-header" data-testid="filter-header-sort">Sort By</h3>
        <div className="space-y-2">
          <div className="filter-option">
            <input
              type="radio"
              id="sort-fees"
              name="sortBy"
              className="mt-0.5"
              checked={filters.sortBy === "fees"}
              onChange={() => handleSortChange("fees")}
              data-testid="sort-fees"
            />
            <label htmlFor="sort-fees" className="ml-2 text-sm">
              Fees (Low to High)
            </label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="sort-experience"
              name="sortBy"
              className="mt-0.5"
              checked={filters.sortBy === "experience"}
              onChange={() => handleSortChange("experience")}
              data-testid="sort-experience"
            />
            <label htmlFor="sort-experience" className="ml-2 text-sm">
              Experience (High to Low)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
