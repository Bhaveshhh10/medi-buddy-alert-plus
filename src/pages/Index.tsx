
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Medicine, MedicineType } from "@/types/medicine";
import { MedicineTypeSection } from "@/components/medicine/MedicineTypeSection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load medicines from localStorage
    const loadMedicines = () => {
      try {
        const savedMedicines = localStorage.getItem("medicines");
        if (savedMedicines) {
          setMedicines(JSON.parse(savedMedicines));
        }
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  const handleAddMedicine = () => {
    navigate("/add-medicine");
  };

  // Group medicines by type
  const oneTimeMedicines = medicines.filter(med => med.type === "one-time");
  const regularMedicines = medicines.filter(med => med.type === "regular");
  const courseMedicines = medicines.filter(med => med.type === "course");

  return (
    <PageLayout title="MediBuddy">
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10">Loading your medicines...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Medicines</h2>
              <Button onClick={handleAddMedicine} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Medicine
              </Button>
            </div>

            {medicines.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No medicines added yet</p>
                <Button onClick={handleAddMedicine} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Medicine
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <MedicineTypeSection 
                  title="One-time Medicines" 
                  medicines={oneTimeMedicines} 
                  emptyMessage="No one-time medicines"
                />
                
                <MedicineTypeSection 
                  title="Regular Medicines" 
                  medicines={regularMedicines} 
                  emptyMessage="No regular medicines"
                />
                
                <MedicineTypeSection 
                  title="Course Medicines" 
                  medicines={courseMedicines} 
                  emptyMessage="No course medicines"
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Index;
