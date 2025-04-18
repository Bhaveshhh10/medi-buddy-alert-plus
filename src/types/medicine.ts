
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
  stock: number;
  startDate?: string;
  endDate?: string;
  dosage: string;
  createdAt: string;
  whatsappNumber?: string;
}
