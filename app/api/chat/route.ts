import { streamText } from "ai"; // assuming this is still relevant for your use case
import fetch from "node-fetch"; // Ensure node-fetch is installed or use the native fetch in Next.js if available

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, style } = await req.json();

    // Updated system message to clarify we want a reply to the user's post
    const systemMessage = `You are a social media expert that generates suggested replies to posts.
    The user will provide a post they want to reply to, and you should generate a reply in the style: "${style}".
    Your response should be a direct reply to the post content, as if the user is responding to someone else's post.
    Keep your response concise and tweet-length (under 280 characters when possible).
    Make the reply engaging, relevant to the post content, and authentic to the specified style.
    Do not mention that you are an AI or that you're responding in a specific style.`;

    // Log for debugging
    console.log("Processing request with style:", style);

    // Prepare the Gemini API request payload
    const payload = {
      model: "gemini-1.5-flash", // replace with the appropriate model name if needed
      messages: messages,
      system: systemMessage,
    };

    // Send the request to the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    // Parse the response
    const result = (await response.json()) as { generatedContent: string };

    // Assuming the response has a 'generatedContent' field with the reply
    const reply = result.generatedContent;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
