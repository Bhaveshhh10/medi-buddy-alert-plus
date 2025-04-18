
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { MessageSquare } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageLayout({ 
  children, 
  title, 
  showBackButton = false,
  onBack 
}: PageLayoutProps) {
  const handleEmergencyContact = () => {
    // WhatsApp message with predefined text
    const message = "Hello, I'm running out of medicine and need a refill soon.";
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the message
    // Note: In a real app, you'd store the emergency contact number
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center">
          {showBackButton && (
            <button 
              onClick={onBack} 
              className="mr-2 p-2 rounded-full bg-gray-100"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-md mx-auto p-4">
        {children}
      </main>

      {/* Emergency contact button - WhatsApp */}
      <button 
        onClick={handleEmergencyContact}
        className="fixed left-4 bottom-24 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-200 hover:scale-105"
        aria-label="Contact emergency person via WhatsApp"
      >
        <MessageSquare size={28} />
      </button>

      {/* Bottom navigation */}
      <Navbar />
    </div>
  );
}
