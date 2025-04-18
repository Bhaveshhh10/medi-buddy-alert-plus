
import { Clock, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { formatMedicineSchedule } from "@/utils/formatters";
import { Link } from "react-router-dom";

interface MedicineCardProps {
  medicine: Medicine;
  onDelete: (id: string) => void;
}

export function MedicineCard({ medicine, onDelete }: MedicineCardProps) {
  const isLowStock = medicine.stock <= 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
      <div className="flex items-start gap-3">
        {/* Medicine image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          {medicine.photoUrl ? (
            <img 
              src={medicine.photoUrl} 
              alt={medicine.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-xs text-center p-2">No image</div>
          )}
        </div>

        {/* Medicine info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{medicine.name}</h3>
            
            <div className="flex gap-2">
              <Link to={`/edit-medicine/${medicine.id}`} className="text-gray-500">
                <Edit size={18} />
              </Link>
              <button 
                onClick={() => onDelete(medicine.id)} 
                className="text-gray-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <p className="text-sm mb-2">{medicine.dosage}</p>
          
          {/* Schedule information */}
          <div className="flex items-center text-gray-500 mb-2">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">{formatMedicineSchedule(medicine)}</span>
          </div>
          
          {/* Stock warning if needed */}
          {isLowStock && (
            <div className="mt-2 flex items-center text-mediBuddy-orange">
              <AlertTriangle size={16} className="mr-1" />
              <span className="text-sm">Low stock: {medicine.stock} left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
