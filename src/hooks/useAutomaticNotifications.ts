
import { useEffect } from 'react';
import { Medicine } from '@/types/medicine';
import { toast } from 'sonner';

export const useAutomaticNotifications = () => {
  useEffect(() => {
    // Check every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

      // Get medicines from localStorage
      const savedMedicines = localStorage.getItem('medicines');
      if (!savedMedicines) return;

      const medicines: Medicine[] = JSON.parse(savedMedicines);

      medicines.forEach(medicine => {
        if (!medicine.whatsappNumber) return;

        medicine.alarms.forEach(alarm => {
          if (!alarm.enabled) return;

          // For regular medicines, check if it's scheduled for today
          if (medicine.type === 'regular' && alarm.days && !alarm.days.includes(currentDay)) {
            return;
          }

          // Check if it's time to send notification
          if (alarm.time === currentTime) {
            const message = `Time to take your medicine: ${medicine.name} - ${medicine.dosage}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${medicine.whatsappNumber}?text=${encodedMessage}`, '_blank');
            toast.success(`Sent WhatsApp notification for ${medicine.name}`);
          }
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);
};
