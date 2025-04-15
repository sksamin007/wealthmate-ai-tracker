
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRight } from "lucide-react";
import Header from "./Header";
import NetWorthDashboard from "../dashboard/NetWorthDashboard";
import GoalPlanner from "../goals/GoalPlanner";
import AiAdviser from "../ai/AiAdviser";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:py-12 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 md:w-[600px]">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="ai">AI Adviser</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gradient">
                Your Net Worth Dashboard
              </h1>
              <button 
                className="text-primary flex items-center gap-1 text-sm font-medium"
                onClick={() => setActiveTab("goals")}
              >
                Plan Your Goals <MoveRight className="h-4 w-4" />
              </button>
            </div>
            
            <NetWorthDashboard />
          </TabsContent>
          
          <TabsContent value="goals">
            <GoalPlanner />
          </TabsContent>
          
          <TabsContent value="ai">
            <AiAdviser />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 WealthMate AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
