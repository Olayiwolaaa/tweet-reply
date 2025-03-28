"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, MessageCircle, Repeat, Heart, Bookmark, Share } from "lucide-react"

interface CommentCardProps {
  response: string
  style: string
  onCopy: () => void
}

export default function CommentCard({ response, style, onCopy }: CommentCardProps) {
  return (
    <Card className="p-4 border border-border hover:bg-accent/5 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          {style.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold flex items-center">
                {style}
                <span className="ml-1 text-primary">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                  </svg>
                </span>
              </div>
              <div className="text-sm text-muted-foreground">@{style.toLowerCase().replace(/\s+/g, "")}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:bg-transparent"
              onClick={onCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Highlight the response with a border to make it more visible */}
          <div className="relative whitespace-pre-wrap my-3 text-foreground pr-8 p-3 border border-primary/20 rounded-md bg-primary/5">
            {response}
            <Button variant="outline" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={onCopy}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            {new Date().toLocaleTimeString()} · {new Date().toLocaleDateString()}
          </div>

          <div className="flex justify-between text-muted-foreground border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-green-500 hover:bg-green-500/10">
              <Repeat className="h-4 w-4 mr-1" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500 hover:bg-red-500/10">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

