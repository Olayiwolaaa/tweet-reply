import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, style } = await req.json()

    // Updated system message to clarify we want a reply to the user's post
    const systemMessage = `You are a social media expert that generates suggested replies to posts.
    The user will provide a post they want to reply to, and you should generate a reply in the style: "${style}".
    Your response should be a direct reply to the post content, as if the user is responding to someone else's post.
    Keep your response concise and tweet-length (under 280 characters when possible).
    Make the reply engaging, relevant to the post content, and authentic to the specified style.
    Do not mention that you are an AI or that you're responding in a specific style.`

    // Log for debugging
    console.log("Processing request with style:", style)

    const result = streamText({
      model: openai("gpt-4o"),
      messages: messages,
      system: systemMessage,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

