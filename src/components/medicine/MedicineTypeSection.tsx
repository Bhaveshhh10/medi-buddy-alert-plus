
import { MedicineType } from "@/types/medicine";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MedicineTypeSectionProps {
  title: string;
  icon: ReactNode;
  type: MedicineType;
  activeType: MedicineType | null;
  count: number;
  onClick: (type: MedicineType) => void;
}

export function MedicineTypeSection({
  title,
  icon,
  type,
  activeType,
  count,
  onClick
}: MedicineTypeSectionProps) {
  const isActive = activeType === type;
  
  return (
    <button
      onClick={() => onClick(type)}
      className={cn(
        "flex flex-col items-center p-4 rounded-xl w-full transition-all",
        isActive 
          ? "bg-mediBuddy-blue text-white" 
          : "bg-white text-gray-800 hover:bg-gray-50"
      )}
    >
      <div className={cn(
        "p-3 rounded-full mb-2",
        isActive ? "bg-white/20" : "bg-mediBuddy-lightBlue"
      )}>
        {icon}
      </div>
      <span className="font-medium text-lg">{title}</span>
      <span className={cn(
        "text-sm mt-1",
        isActive ? "text-white/80" : "text-gray-500"
      )}>
        {count} {count === 1 ? 'medicine' : 'medicines'}
      </span>
    </button>
  );
}
