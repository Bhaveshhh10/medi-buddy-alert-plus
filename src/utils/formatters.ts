
import { Medicine } from "@/types/medicine";

export function formatMedicineSchedule(medicine: Medicine): string {
  if (medicine.type === 'one-time') {
    return `One time on ${medicine.alarms[0]?.time || 'schedule not set'}`;
  }
  
  if (medicine.type === 'regular') {
    const firstAlarm = medicine.alarms[0];
    if (!firstAlarm) return 'Schedule not set';
    
    const days = firstAlarm.days?.join(', ') || 'every day';
    return `${firstAlarm.time} on ${days}`;
  }
  
  if (medicine.type === 'course') {
    const startDate = medicine.startDate ? new Date(medicine.startDate).toLocaleDateString() : 'undefined start';
    const endDate = medicine.endDate ? new Date(medicine.endDate).toLocaleDateString() : 'undefined end';
    return `Course: ${startDate} to ${endDate}`;
  }
  
  return 'Schedule not set';
}

export function formatTime(timeString: string): string {
  try {
    // Assumes format is "HH:MM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${amPm}`;
  } catch (error) {
    return timeString;
  }
}
