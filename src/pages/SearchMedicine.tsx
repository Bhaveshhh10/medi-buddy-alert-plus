
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Medicine } from "@/types/medicine";
import { Search } from "lucide-react";
import { MedicineCard } from "@/components/medicine/MedicineCard";
import { toast } from "sonner";

const SearchMedicine = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    // Load medicines from localStorage
    try {
      const savedMedicines = localStorage.getItem("medicines");
      if (savedMedicines) {
        setMedicines(JSON.parse(savedMedicines));
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
    }
  }, []);

  useEffect(() => {
    // Filter medicines based on search term
    if (searchTerm.trim() === "") {
      setFilteredMedicines([]);
    } else {
      const filtered = medicines.filter(
        medicine => 
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm, medicines]);

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
      
      // Update local state
      setMedicines(updatedMedicines);
      setFilteredMedicines(prevFiltered => 
        prevFiltered.filter(med => med.id !== id)
      );
      
      // Show success message
      toast.success("Medicine removed successfully");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Failed to remove medicine");
    }
  };

  return (
    <PageLayout title="Search Medicines">
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {searchTerm.trim() === "" ? (
            <p className="text-center text-gray-500 py-8">Enter a medicine name to search</p>
          ) : filteredMedicines.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No medicines found for "{searchTerm}"</p>
          ) : (
            filteredMedicines.map(medicine => (
              <MedicineCard 
                key={medicine.id} 
                medicine={medicine} 
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchMedicine;
