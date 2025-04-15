
import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "ai";
  content: string;
}

// OpenAI API key
const OPENAI_API_KEY = "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";

const AiAdviser = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle sending chat messages to OpenAI API
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful financial advisor. Provide short, practical financial advice based on the user's question. Keep your responses brief, focused, and actionable."
            },
            ...messages.map(msg => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content
            })),
            { role: "user", content: input }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get AI response");
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: "ai", content: aiMessage }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to the chat
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "Sorry, I couldn't process your request. Please try again later." 
      }]);
    } finally {
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
                <Sparkles className="h-12 w-12 mb-4 opacity-50" />
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
