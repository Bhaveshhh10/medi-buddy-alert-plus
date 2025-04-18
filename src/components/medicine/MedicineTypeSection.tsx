
import React from "react";
import { Medicine } from "@/types/medicine";
import { MedicineCard } from "./MedicineCard";
import { toast } from "sonner";

export interface MedicineTypeSectionProps {
  title: string;
  medicines: Medicine[];
  emptyMessage: string;
}

export function MedicineTypeSection({ 
  title, 
  medicines, 
  emptyMessage 
}: MedicineTypeSectionProps) {
  
  const handleDelete = (id: string) => {
    try {
      // Get current medicines
      const storedMedicines = localStorage.getItem("medicines");
      if (!storedMedicines) return;
      
      // Filter out the medicine to delete
      const medicineList: Medicine[] = JSON.parse(storedMedicines);
      const updatedMedicines = medicineList.filter(med => med.id !== id);
      
      // Save updated list
      localStorage.setItem("medicines", JSON.stringify(updatedMedicines));
      
      // Show success message
      toast.success("Medicine removed successfully");
      
      // Refresh page to show updated list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Failed to remove medicine");
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      
      {medicines.length === 0 ? (
        <p className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">{emptyMessage}</p>
      ) : (
        <div>
          {medicines.map(medicine => (
            <MedicineCard 
              key={medicine.id} 
              medicine={medicine} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
