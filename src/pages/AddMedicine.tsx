
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Medicine, MedicineType, Alarm } from "@/types/medicine";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const AddMedicine = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MedicineType>("one-time");
  const [time, setTime] = useState("08:00");
  const [days, setDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dosage, setDosage] = useState("1 pill");
  const [stock, setStock] = useState(30);
  const [photoUrl, setPhotoUrl] = useState("");

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const handleDayToggle = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a medicine name");
      return;
    }

    const alarm: Alarm = {
      id: uuidv4(),
      time,
      enabled: true,
    };

    if (type === "regular") {
      alarm.days = days.length > 0 ? days : daysOfWeek; // Default to all days if none selected
    }

    const newMedicine: Medicine = {
      id: uuidv4(),
      name,
      description,
      type,
      alarms: [alarm],
      stock,
      dosage,
      createdAt: new Date().toISOString(),
      photoUrl,
    };

    if (type === "course") {
      if (!startDate || !endDate) {
        toast.error("Please enter both start and end dates for course medicine");
        return;
      }
      newMedicine.startDate = startDate;
      newMedicine.endDate = endDate;
    }

    // Save to localStorage
    try {
      const existingMedicines = localStorage.getItem("medicines");
      const medicines = existingMedicines ? JSON.parse(existingMedicines) : [];
      medicines.push(newMedicine);
      localStorage.setItem("medicines", JSON.stringify(medicines));
      
      toast.success("Medicine added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error saving medicine:", error);
      toast.error("Failed to save medicine");
    }
  };

  return (
    <PageLayout title="Add Medicine" showBackButton onBack={() => navigate("/")}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Medicine Name</Label>
          <Input
            id="name"
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter medicine description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Medicine Type</Label>
          <Select
            value={type}
            onValueChange={(value: MedicineType) => setType(value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time">One-time</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="course">Course</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {type === "regular" && (
          <div className="space-y-2">
            <Label>Days</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={days.includes(day) ? "default" : "outline"}
                  className="text-sm h-9"
                  onClick={() => handleDayToggle(day)}
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {type === "course" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            placeholder="e.g., 1 pill, 5ml"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Medicine Photo (Optional)</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {photoUrl && (
            <div className="mt-2">
              <img 
                src={photoUrl} 
                alt="Medicine preview" 
                className="w-32 h-32 object-cover rounded-lg border" 
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">Add Medicine</Button>
      </form>
    </PageLayout>
  );
};

export default AddMedicine;
