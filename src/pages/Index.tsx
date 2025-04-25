
import React from "react";
import { useDoctorData } from "../hooks/useDoctorData";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import DoctorList from "../components/DoctorList";

const Index: React.FC = () => {
  const {
    doctors,
    allDoctors,
    loading,
    error,
    filters,
    allSpecialties,
    updateFilters,
  } = useDoctorData();

  const handleSearch = (term: string) => {
    updateFilters({ searchTerm: term });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6 px-4">
          <SearchBar
            doctors={allDoctors}
            searchTerm={filters.searchTerm}
            onSearch={handleSearch}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 px-4">
          {/* Filter Panel - Full width on mobile, sidebar on larger screens */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              allSpecialties={allSpecialties}
              updateFilters={updateFilters}
            />
          </aside>
          
          {/* Doctor List */}
          <div className="flex-grow">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-700">
                {loading ? "Loading doctors..." : `${doctors.length} Doctors Found`}
              </h2>
            </div>
            
            <DoctorList
              doctors={doctors}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
