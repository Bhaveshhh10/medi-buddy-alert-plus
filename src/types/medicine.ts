
export type MedicineType = 'one-time' | 'regular' | 'course';

export interface Alarm {
  id: string;
  time: string; // format: HH:MM
  days?: string[]; // ['Monday', 'Tuesday', etc.] for regular
  enabled: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  type: MedicineType;
  alarms: Alarm[];
  photoUrl?: string;
  stock: number; // to track if medicine is running low
  startDate?: string; // for course-based
  endDate?: string; // for course-based
  dosage: string; // e.g., "1 pill", "5ml"
  createdAt: string;
}
