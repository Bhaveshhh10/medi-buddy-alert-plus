
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Medicine, Alarm } from "@/types/medicine";
import { formatTime } from "@/utils/formatters";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type MedicineWithAlarm = {
  medicineId: string;
  medicineName: string;
  alarm: Alarm;
  type: Medicine["type"];
  dosage: string;
};

const Alarms = () => {
  const [alarms, setAlarms] = useState<MedicineWithAlarm[]>([]);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = () => {
    try {
      const savedMedicines = localStorage.getItem("medicines");
      if (savedMedicines) {
        const medicines: Medicine[] = JSON.parse(savedMedicines);
        
        // Extract all alarms from medicines
        const extractedAlarms: MedicineWithAlarm[] = [];
        
        medicines.forEach(medicine => {
          medicine.alarms.forEach(alarm => {
            extractedAlarms.push({
              medicineId: medicine.id,
              medicineName: medicine.name,
              alarm: alarm,
              type: medicine.type,
              dosage: medicine.dosage
            });
          });
        });
        
        // Sort alarms by time
        extractedAlarms.sort((a, b) => {
          return a.alarm.time.localeCompare(b.alarm.time);
        });
        
        setAlarms(extractedAlarms);
      }
    } catch (error) {
      console.error("Error loading alarms:", error);
    }
  };

  const toggleAlarmStatus = (medicineId: string, alarmId: string, enabled: boolean) => {
    try {
      const savedMedicines = localStorage.getItem("medicines");
      if (savedMedicines) {
        const medicines: Medicine[] = JSON.parse(savedMedicines);
        
        // Find the medicine and update the alarm
        const updatedMedicines = medicines.map(medicine => {
          if (medicine.id === medicineId) {
            const updatedAlarms = medicine.alarms.map(alarm => {
              if (alarm.id === alarmId) {
                return { ...alarm, enabled };
              }
              return alarm;
            });
            return { ...medicine, alarms: updatedAlarms };
          }
          return medicine;
        });
        
        // Save back to localStorage
        localStorage.setItem("medicines", JSON.stringify(updatedMedicines));
        
        // Update local state
        setAlarms(alarms.map(item => {
          if (item.medicineId === medicineId && item.alarm.id === alarmId) {
            return { ...item, alarm: { ...item.alarm, enabled } };
          }
          return item;
        }));
        
        toast.success(`Alarm ${enabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error("Error updating alarm:", error);
      toast.error("Failed to update alarm");
    }
  };

  const getAlarmSchedule = (item: MedicineWithAlarm) => {
    if (item.type === "one-time") {
      return "One time only";
    } else if (item.type === "regular") {
      const days = item.alarm.days?.join(", ") || "Every day";
      return days;
    } else if (item.type === "course") {
      return "During course";
    }
    return "";
  };

  return (
    <PageLayout title="Medication Alarms">
      <div className="space-y-6">
        {alarms.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No alarms set</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((item) => (
              <div 
                key={`${item.medicineId}-${item.alarm.id}`}
                className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between"
              >
                <div>
                  <div className="text-lg font-medium">{formatTime(item.alarm.time)}</div>
                  <div className="text-base">{item.medicineName}</div>
                  <div className="text-sm text-gray-500">{item.dosage}</div>
                  <div className="text-xs text-gray-400">{getAlarmSchedule(item)}</div>
                </div>
                <Switch 
                  checked={item.alarm.enabled}
                  onCheckedChange={(checked) => 
                    toggleAlarmStatus(item.medicineId, item.alarm.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Alarms;
