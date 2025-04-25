
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Doctor, FilterState } from "../types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export const useDoctorData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  
  // Initial filter state from URL params
  const [filters, setFilters] = useState<FilterState>({
    consultationType: searchParams.get("consultationType"),
    specialties: searchParams.getAll("specialty"),
    sortBy: searchParams.get("sortBy"),
    searchTerm: searchParams.get("search") || "",
  });

  // Fetch doctors data once
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data to match our Doctor interface
        const processedData = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialities?.[0]?.name || "",
          qualification: "",  // API doesn't provide this directly
          experience: parseInt(doc.experience?.split(" ")?.[0] || "0"),
          rating: 0,  // API doesn't provide this
          fee: parseInt(doc.fees?.replace("₹ ", "") || "0"),
          city: doc.clinic?.address?.city || "",
          clinic: doc.clinic?.name || "",
          consultationType: doc.video_consult ? "Video Consult" : "In Clinic",
          profilePic: doc.photo || "",
          address: doc.clinic?.address?.address_line1 || "",
          about: doc.doctor_introduction || "",
          services: [] // API doesn't provide this
        }));
        
        setAllDoctors(processedData);
        
        // Extract unique specialties
        const specialties = [...new Set(processedData.map((doc: Doctor) => doc.specialty))];
        setAllSpecialties(specialties as string[]);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Apply filters and update URL
  useEffect(() => {
    if (allDoctors.length === 0) return;

    // Update URL params
    const newParams = new URLSearchParams();
    
    if (filters.consultationType) {
      newParams.set("consultationType", filters.consultationType);
    }
    
    if (filters.sortBy) {
      newParams.set("sortBy", filters.sortBy);
    }
    
    if (filters.searchTerm) {
      newParams.set("search", filters.searchTerm);
    }
    
    filters.specialties.forEach(specialty => {
      newParams.append("specialty", specialty);
    });
    
    setSearchParams(newParams, { replace: true });
    
    // Filter and sort doctors
    let filteredDocs = [...allDoctors];
    
    // Apply consultation type filter
    if (filters.consultationType) {
      filteredDocs = filteredDocs.filter(
        doc => doc.consultationType === filters.consultationType
      );
    }
    
    // Apply specialties filter
    if (filters.specialties.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.specialties.includes(doc.specialty)
      );
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc =>
        doc.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply sorting
    if (filters.sortBy === "fees") {
      filteredDocs.sort((a, b) => a.fee - b.fee);
    } else if (filters.sortBy === "experience") {
      filteredDocs.sort((a, b) => b.experience - a.experience);
    }
    
    setDoctors(filteredDocs);
  }, [filters, allDoctors, setSearchParams]);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    doctors,
    allDoctors,
    loading,
    error,
    filters,
    allSpecialties,
    updateFilters,
  };
};
