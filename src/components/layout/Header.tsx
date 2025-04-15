
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { recordMonthlyNetWorth } from "@/services/netWorthService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRecordNetWorth = () => {
    recordMonthlyNetWorth();
    toast({
      title: "Net Worth Recorded",
      description: "Your current net worth has been saved to your monthly records.",
    });
  };

  return (
    <header
      className={`border-b py-4 px-6 transition-all duration-200 ${
        isSticky ? "sticky top-0 z-50 backdrop-blur-md bg-background/80 shadow-sm" : ""
      }`}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl md:text-2xl">
            <span className="text-gradient">WealthMate AI</span>
          </div>
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecordNetWorth}
            >
              Record Net Worth
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Toggle menu"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isExpanded && (
        <div className="container mt-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleRecordNetWorth}
          >
            Record Net Worth
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
