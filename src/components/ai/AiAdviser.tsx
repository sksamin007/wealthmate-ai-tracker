
import { useState } from "react";
import { Bot, Send, Key, DollarSign, LightbulbIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [netWorth, setNetWorth] = useState<number | "">("");
  const [tipResponse, setTipResponse] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(false);
  const { toast } = useToast();

  // Handle sending chat messages
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a financial advisor. Provide helpful, concise financial advice.'
              },
              ...messages.map(msg => ({ role: msg.role === "user" ? "user" : "assistant", content: msg.content })),
              { role: 'user', content: input }
            ],
            max_tokens: 250
          })
        });
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message || "Error fetching AI response");
        }
        
        const aiMessage: Message = { role: "ai", content: data.choices[0].message.content };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Simulate AI response for testing
        setTimeout(() => {
          // Get a random financial tip as a placeholder
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
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get personalized tip based on net worth
  const getPersonalizedTip = async () => {
    if (!netWorth) {
      toast({
        title: "Input Required",
        description: "Please enter your net worth to get a personalized tip.",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to get a personalized tip.",
        variant: "destructive",
      });
      return;
    }
    
    setTipLoading(true);
    setTipResponse(null);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor. Provide a short, helpful financial tip based on the user\'s net worth. Keep your response under 100 words and make it personalized.'
            },
            { 
              role: 'user', 
              content: `Give a smart financial tip for someone with ৳${netWorth} net worth.` 
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Error fetching AI tip");
      }
      
      setTipResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching AI tip:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI tip. Please try again.",
        variant: "destructive",
      });
      setTipResponse("Unable to generate tip. Please check your API key and try again.");
    } finally {
      setTipLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-gradient">AI Financial Adviser</h2>

      <Tabs defaultValue="personalized">
        <TabsList className="grid grid-cols-2 w-[400px] max-w-full">
          <TabsTrigger value="personalized">Personalized Tip</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personalized" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5" />
                Get Personalized Financial Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openaiKey">OpenAI API Key</Label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="openaiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netWorth">Your Net Worth (৳)</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="netWorth"
                    type="number"
                    placeholder="Enter your net worth"
                    value={netWorth}
                    onChange={(e) => setNetWorth(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={getPersonalizedTip} 
                disabled={tipLoading || !apiKey || netWorth === ''}
                className="w-full"
              >
                {tipLoading ? "Getting Advice..." : "Get Financial Advice"}
              </Button>
              
              <div id="tipBox" className="mt-4">
                {tipLoading ? (
                  <div className="flex items-center justify-center p-8 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-300"></div>
                      <span className="ml-2">Consulting the AI...</span>
                    </div>
                  </div>
                ) : tipResponse ? (
                  <div className="p-4 border rounded-md bg-card text-card-foreground">
                    <p>{tipResponse}</p>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md text-center text-muted-foreground">
                    <p>Enter your net worth and API key to get personalized financial advice</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat with WealthMate AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKey ? (
                <>
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
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    To use the AI features, please enter your OpenAI API key.
                    You can get one from{" "}
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      OpenAI's website
                    </a>
                    .
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="api-key-chat">OpenAI API Key</Label>
                    <Input
                      id="api-key-chat"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiAdviser;
