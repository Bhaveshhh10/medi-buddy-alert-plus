
import { Medicine } from '../types/medicine';

// Key for localStorage
const MEDICINES_STORAGE_KEY = 'medibuddy-medicines';

// Get all medicines
export const getAllMedicines = (): Medicine[] => {
  const storedData = localStorage.getItem(MEDICINES_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Add a new medicine
export const addMedicine = (medicine: Medicine): void => {
  const medicines = getAllMedicines();
  medicines.push(medicine);
  localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(medicines));
};

// Update an existing medicine
export const updateMedicine = (updatedMedicine: Medicine): void => {
  const medicines = getAllMedicines();
  const index = medicines.findIndex((med) => med.id === updatedMedicine.id);
  
  if (index !== -1) {
    medicines[index] = updatedMedicine;
    localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(medicines));
  }
};

// Delete a medicine
export const deleteMedicine = (id: string): void => {
  const medicines = getAllMedicines();
  const filteredMedicines = medicines.filter((medicine) => medicine.id !== id);
  localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(filteredMedicines));
};

// Search medicines by name
export const searchMedicines = (query: string): Medicine[] => {
  const medicines = getAllMedicines();
  if (!query.trim()) return medicines;
  
  const lowerCaseQuery = query.toLowerCase();
  return medicines.filter(
    (medicine) => 
      medicine.name.toLowerCase().includes(lowerCaseQuery) || 
      medicine.description.toLowerCase().includes(lowerCaseQuery)
  );
};

// Get medicines by type
export const getMedicinesByType = (type: string): Medicine[] => {
  const medicines = getAllMedicines();
  return medicines.filter((medicine) => medicine.type === type);
};

// Check if any medicines are low in stock
export const getLowStockMedicines = (threshold: number = 5): Medicine[] => {
  const medicines = getAllMedicines();
  return medicines.filter((medicine) => medicine.stock <= threshold);
};
