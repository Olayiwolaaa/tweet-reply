"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import CommentCard from "@/components/comment-card";
import HistoryList from "@/components/history-list";
import ThemeToggle from "@/components/theme-toggle";
import LoadingIndicator from "@/components/loading-indicator";
import { RefreshCw } from "lucide-react";
import { Footer } from "@/components/footer";
import { PostHogProvider } from "./providers";

const MAX_HISTORY_ITEMS = 10;

export default function Home() {
  const [style, setStyle] = useState("");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    Array<{ input: string; style: string; response: string }>
  >([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Clear history after 24 hours
  useEffect(() => {
    const clearHistoryInterval = setInterval(() => {
      setHistory([]);
      toast({
        title: "History cleared",
        description: "Your history has been automatically cleared",
      });
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(clearHistoryInterval);
  }, [toast]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast({
        title: "Content pasted",
        description: "Text has been pasted from clipboard",
      });
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Please check clipboard permissions",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a reply",
        variant: "destructive",
      });
      return;
    }

    if (!style.trim()) {
      toast({
        title: "Style required",
        description: "Please specify a style for the response",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          style,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const data = await response.json();
      setCurrentResponse(data.reply);

      // Add to history
      const newEntry = { input, style, response: data.reply };
      setHistory((prev) => [newEntry, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reply",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!input.trim() || !style.trim()) return;

    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          style,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const data = await response.json();
      setCurrentResponse(data.reply);

      // Update history
      setHistory((prev) =>
        prev.map((item, i) =>
          i === 0 ? { ...item, response: data.reply } : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate reply",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History cleared",
      description: "Your history has been cleared",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-8">
        <PostHogProvider>
          <main className="w-full max-w-xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-primary">Twitter Reply</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  Clear History
                </Button>
                <ThemeToggle />
              </div>
            </div>

            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-background border">
                <TabsTrigger
                  value="generate"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Generate
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                <Card className="p-4 border border-border">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="input"
                        className="block text-sm font-medium mb-1"
                      >
                        Post to Reply To
                      </label>
                      <div className="relative">
                        <Textarea
                          id="input"
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Paste the post you want to reply to..."
                          className="min-h-[120px] resize-y border-border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-2"
                          onClick={handlePaste}
                        >
                          Paste
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="style"
                        className="block text-sm font-medium mb-1"
                      >
                        Reply Style
                      </label>
                      <Input
                        id="style"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        placeholder="e.g., friendly, sarcastic, nerdy, Yoruba demon..."
                        className="border-border"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Generating Reply..." : "Generate Reply"}
                    </Button>
                  </form>
                </Card>

                {/* Loading indicator while generating */}
                {isLoading && <LoadingIndicator />}

                {/* Display the response if available */}
                {currentResponse && !isLoading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Generated Reply</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Try Another
                      </Button>
                    </div>

                    <CommentCard
                      response={currentResponse}
                      style={style}
                      onCopy={() => copyToClipboard(currentResponse)}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Recent Replies</h2>
                  <div className="text-xs text-muted-foreground">
                    Showing {history.length} of {MAX_HISTORY_ITEMS} max items
                  </div>
                </div>
                <HistoryList history={history} onCopy={copyToClipboard} />
              </TabsContent>
            </Tabs>

            <Toaster />
          </main>
        </PostHogProvider>
      </div>
      <Footer />
    </div>
  );
}
