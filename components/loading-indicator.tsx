import { Card } from "@/components/ui/card"

export default function LoadingIndicator() {
  return (
    <Card className="p-6 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
        </div>
        <p className="text-sm text-muted-foreground">Generating your reply...</p>
        <div className="w-full max-w-xs bg-secondary rounded-full h-1.5 mt-2">
          <div className="bg-primary h-1.5 rounded-full animate-pulse-width"></div>
        </div>
      </div>
    </Card>
  )
}

