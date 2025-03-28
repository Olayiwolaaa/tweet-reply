"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Repeat,
  Heart,
  Copy,
  Bookmark,
  Share,
} from "lucide-react";

interface HistoryItem {
  input: string;
  style: string;
  response: string;
}

interface HistoryListProps {
  history: HistoryItem[];
  onCopy: (text: string) => void;
}

// Format numbers to 1k, 2k, etc.
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`.replace(".0", "");
  }
  return num.toString();
};

// Function to generate random exaggerated metrics
const generateMetrics = () => {
  const base = Math.floor(Math.random() * 1000) + 500; // 500-1500 base
  return {
    comments: Math.floor(base * (0.8 + Math.random() * 0.4)), // 80-120% of base
    retweets: Math.floor(base * (1.2 + Math.random() * 0.8)), // 120-200% of base
    likes: Math.floor(base * (1.5 + Math.random() * 1.0)), // 150-250% of base
    bookmarks: Math.floor(base * (0.5 + Math.random() * 0.3)), // 50-80% of base
  };
};

export default function HistoryList({ history, onCopy }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No history yet. Generate some replies to see them here.</p>
        <p className="text-xs mt-2">
          History is automatically cleared periodically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => {
        const metrics = generateMetrics();
        const timestamp = new Date();

        return (
          <Card
            key={index}
            className="p-4 border border-border hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {item.style.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center">
                      {item.style}
                      <span className="ml-1 text-primary">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                        </svg>
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{item.style.toLowerCase().replace(/\s+/g, "")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-transparent"
                    onClick={() => onCopy(item.response)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground mt-1 mb-2">
                  Replying to:{" "}
                  <span className="text-primary">
                    "{item.input.substring(0, 50)}
                    {item.input.length > 50 ? "..." : ""}"
                  </span>
                </div>

                <div className="relative whitespace-pre-wrap my-3 text-foreground pr-8 p-3 border border-primary/20 rounded-md bg-primary/5">
                  {item.response}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => onCopy(item.response)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  {timestamp.toLocaleTimeString()} ·{" "}
                  {timestamp.toLocaleDateString()}
                </div>

                <div className="flex justify-between text-muted-foreground border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary hover:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">
                      {formatNumber(metrics.comments)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-green-500 hover:bg-green-500/10"
                  >
                    <Repeat className="h-4 w-4 mr-1" />
                    <span className="text-xs">
                      {formatNumber(metrics.retweets)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-xs">
                      {formatNumber(metrics.likes)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-blue-500 hover:bg-blue-500/10"
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    <span className="text-xs">
                      {formatNumber(metrics.bookmarks)}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary hover:bg-primary/10"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
