
import { useState } from "react";
import { Bot, Send, LightbulbIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  role: "user" | "ai";
  content: string;
}

// Sample tips that simulate AI responses before API integration
const sampleTips = [
  {
    title: "Emergency Fund",
    content: "Aim to save 3-6 months of living expenses in an easily accessible account for emergencies."
  },
  {
    title: "Debt Repayment",
    content: "Consider using either the avalanche method (highest interest first) or snowball method (smallest balance first) for debt repayment."
  },
  {
    title: "401(k) Match",
    content: "If your employer offers a 401(k) match, contribute at least enough to get the full match—it's essentially free money."
  },
  {
    title: "Asset Allocation",
    content: "A common rule of thumb is to subtract your age from 110 to determine what percentage of your portfolio should be in stocks."
  },
  {
    title: "Taxes & Retirement",
    content: "Consider using tax-advantaged accounts like IRAs and HSAs to reduce your tax burden while saving for the future."
  }
];

const AiAdviser = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle sending chat messages
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response (in a real app, you'd replace this with an API call)
      setTimeout(() => {
        // Get a random financial tip as a response
        const tipIndex = Math.floor(Math.random() * sampleTips.length);
        const tipContent = sampleTips[tipIndex].content;
        
        // Create personalized response based on user question
        let aiResponse = `Based on your question, here's my advice: ${tipContent}`;
        
        if (input.toLowerCase().includes("invest")) {
          aiResponse = "When investing, consider your risk tolerance, time horizon, and diversification across different asset classes.";
        } else if (input.toLowerCase().includes("debt") || input.toLowerCase().includes("loan")) {
          aiResponse = "Focus on paying off high-interest debt first while making minimum payments on other debts. Consider debt consolidation if you have multiple high-interest loans.";
        } else if (input.toLowerCase().includes("save") || input.toLowerCase().includes("saving")) {
          aiResponse = "The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.";
        }
        
        setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-gradient">AI Financial Adviser</h2>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with WealthMate AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[350px] overflow-y-auto space-y-4 p-4 border rounded-md">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 opacity-50" />
                <p>Ask me any financial question to get started!</p>
                <p className="text-sm mt-2">Examples:</p>
                <ul className="text-sm mt-1">
                  <li>"How should I start investing with $1000?"</li>
                  <li>"What's the best way to pay off my credit card debt?"</li>
                  <li>"How much should I save for retirement?"</li>
                </ul>
              </div>
            ) : (
              messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a financial question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiAdviser;
