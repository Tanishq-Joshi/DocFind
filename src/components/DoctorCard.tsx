
import React from "react";
import { Doctor } from "../types/doctor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card className="doctor-card overflow-hidden" data-testid="doctor-card">
      <div className="doctor-img-container h-32 w-full">
        <div className="w-full h-full bg-gradient-to-r from-medical-100 to-medical-200 flex items-center justify-center">
          <span className="text-4xl text-medical-400">{doctor.name.charAt(0)}</span>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="doctor-name text-lg font-bold" data-testid="doctor-name">
          {doctor.name}
        </h3>
        
        <p className="doctor-specialty text-sm text-gray-600" data-testid="doctor-specialty">
          {doctor.specialty} · {doctor.qualification}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="doctor-meta flex justify-between items-center mb-3">
          <div className="doctor-experience text-sm" data-testid="doctor-experience">
            <span>{doctor.experience}+ years</span>
          </div>
          
          <div className="doctor-fee text-sm font-semibold" data-testid="doctor-fee">
            ₹{doctor.fee}
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-500">
          <span className="inline-block px-2 py-1 bg-medical-50 text-medical-700 rounded-full text-xs">
            {doctor.consultationType}
          </span>
          <p className="mt-2 truncate">
            {doctor.clinic}, {doctor.city}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
