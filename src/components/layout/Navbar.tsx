
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <NavbarLink 
          to="/" 
          icon={<Home size={28} />} 
          label="Home" 
          active={isActive('/')}
        />
        <NavbarLink 
          to="/add-medicine" 
          icon={<Plus size={28} />} 
          label="Add" 
          active={isActive('/add-medicine')}
        />
        <NavbarLink 
          to="/search" 
          icon={<Search size={28} />} 
          label="Search" 
          active={isActive('/search')}
        />
        <NavbarLink 
          to="/alarms" 
          icon={<Bell size={28} />} 
          label="Alarms" 
          active={isActive('/alarms')}
        />
      </div>
    </nav>
  );
}

type NavbarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavbarLink({ to, icon, label, active }: NavbarLinkProps) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center gap-1", 
        active 
          ? "text-mediBuddy-blue font-medium" 
          : "text-gray-500"
      )}
    >
      <div className={cn(
        "p-2 rounded-full", 
        active ? "bg-mediBuddy-lightBlue" : ""
      )}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
