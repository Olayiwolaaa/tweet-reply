"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import CommentCard from "@/components/comment-card"
import HistoryList from "@/components/history-list"
import ThemeToggle from "@/components/theme-toggle"
import LoadingIndicator from "@/components/loading-indicator"
import { RefreshCw } from "lucide-react"
import { Footer } from "@/components/footer";
import { PostHogProvider } from "./providers";

// Maximum history items to keep
const MAX_HISTORY_ITEMS = 10

export default function Home() {
  const [style, setStyle] = useState("")
  const [history, setHistory] = useState<Array<{ input: string; style: string; response: string }>>([])
  const [currentResponse, setCurrentResponse] = useState<string>("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload } = useChat({
    api: "/api/chat",
    body: {
      style,
    },
    onResponse: () => {
      // Add to history when we get a response
      if (input.trim() && style.trim()) {
        const newEntry = {
          input,
          style,
          response: "",
        }
        setHistory((prev) => {
          // Limit history to MAX_HISTORY_ITEMS
          const newHistory = [newEntry, ...prev]
          if (newHistory.length > MAX_HISTORY_ITEMS) {
            return newHistory.slice(0, MAX_HISTORY_ITEMS)
          }
          return newHistory
        })
      }
    },
    onFinish: (message) => {
      // Set the current response directly
      setCurrentResponse(message.content)

      // Update the last history entry with the response
      if (history.length > 0) {
        setHistory((prev) => [{ ...prev[0], response: message.content }, ...prev.slice(1)])
      }
    },
  })

  // Clear history after 24 hours
  useEffect(() => {
    const clearHistoryInterval = setInterval(
      () => {
        setHistory([])
        toast({
          title: "History cleared",
          description: "Your history has been automatically cleared",
        })
      },
      24 * 60 * 60 * 1000,
    ) // 24 hours

    return () => clearInterval(clearHistoryInterval)
  }, [toast])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      toast({
        title: "Content pasted",
        description: "Text has been pasted from clipboard",
      })
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Please check clipboard permissions",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a reply",
        variant: "destructive",
      })
      return
    }

    if (!style.trim()) {
      toast({
        title: "Style required",
        description: "Please specify a style for the response",
        variant: "destructive",
      })
      return
    }

    // Clear current response when submitting a new request
    setCurrentResponse("")
    handleSubmit(e)
  }

  const handleRetry = () => {
    // Clear current response
    setCurrentResponse("")
    // Use the reload function from useChat to regenerate the response
    reload()
    toast({
      title: "Regenerating reply",
      description: "Generating a new reply with the same style",
    })
  }

  const clearHistory = () => {
    setHistory([])
    toast({
      title: "History cleared",
      description: "Your history has been cleared",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-8">
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
                <form onSubmit={handleFormSubmit} className="space-y-4">
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
                        onChange={handleInputChange}
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

              {/* Display the response if available - GUARANTEED TO SHOW */}
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
        <Footer />
      </PostHogProvider>
    </div>
  );
}

