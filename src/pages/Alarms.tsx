import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Medicine } from "@/types/medicine";
import { formatTime } from "@/utils/formatters";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { useAutomaticNotifications } from "@/hooks/useAutomaticNotifications";

type MedicineWithNotification = {
  medicineId: string;
  medicineName: string;
  alarm: {
    id: string;
    time: string;
    enabled: boolean;
    days?: string[];
  };
  type: Medicine["type"];
  dosage: string;
  whatsappNumber: string;
};

const Alarms = () => {
  const [notifications, setNotifications] = useState<MedicineWithNotification[]>([]);
  
  useAutomaticNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const savedMedicines = localStorage.getItem("medicines");
      if (savedMedicines) {
        const medicines: Medicine[] = JSON.parse(savedMedicines);
        
        const extractedNotifications: MedicineWithNotification[] = [];
        
        medicines.forEach(medicine => {
          if (medicine.whatsappNumber) {
            medicine.alarms.forEach(alarm => {
              extractedNotifications.push({
                medicineId: medicine.id,
                medicineName: medicine.name,
                alarm: alarm,
                type: medicine.type,
                dosage: medicine.dosage,
                whatsappNumber: medicine.whatsappNumber || "",
              });
            });
          }
        });
        
        extractedNotifications.sort((a, b) => {
          return a.alarm.time.localeCompare(b.alarm.time);
        });
        
        setNotifications(extractedNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const toggleNotificationStatus = (medicineId: string, alarmId: string, enabled: boolean) => {
    try {
      const savedMedicines = localStorage.getItem("medicines");
      if (savedMedicines) {
        const medicines: Medicine[] = JSON.parse(savedMedicines);
        
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
        
        localStorage.setItem("medicines", JSON.stringify(updatedMedicines));
        
        setNotifications(notifications.map(item => {
          if (item.medicineId === medicineId && item.alarm.id === alarmId) {
            return { ...item, alarm: { ...item.alarm, enabled } };
          }
          return item;
        }));
        
        toast.success(`WhatsApp notifications ${enabled ? 'enabled' : 'disabled'}`);
        if (enabled) {
          toast.info("You will receive WhatsApp messages automatically at the scheduled times");
        }
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error("Failed to update notification settings");
    }
  };

  const sendWhatsAppMessage = (notification: MedicineWithNotification) => {
    const message = `Time to take your medicine: ${notification.medicineName} - ${notification.dosage}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${notification.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const getSchedule = (item: MedicineWithNotification) => {
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
    <PageLayout title="WhatsApp Notifications">
      <div className="space-y-6">
        {notifications.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No notifications set</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-600">
                WhatsApp messages will be sent automatically at the scheduled times when notifications are enabled.
              </p>
            </div>
            <div className="space-y-4">
              {notifications.map((item) => (
                <div 
                  key={`${item.medicineId}-${item.alarm.id}`}
                  className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between"
                >
                  <div>
                    <div className="text-lg font-medium">{formatTime(item.alarm.time)}</div>
                    <div className="text-base">{item.medicineName}</div>
                    <div className="text-sm text-gray-500">{item.dosage}</div>
                    <div className="text-xs text-gray-400">{getSchedule(item)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => sendWhatsAppMessage(item)}
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Switch 
                      checked={item.alarm.enabled}
                      onCheckedChange={(checked) => 
                        toggleNotificationStatus(item.medicineId, item.alarm.id, checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Alarms;
