import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, style } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const systemMessage = `You are a social media expert that generates suggested replies to posts.
    The user will provide a post they want to reply to, and you should generate a reply in the style: "${style}".
    Your response should be a direct reply to the post content, as if the user is responding to someone else's post.
    Keep your response concise and tweet-length (under 280 characters when possible).
    Make the reply engaging, relevant to the post content, and authentic to the specified style.
    Do not mention that you are an AI or that you're responding in a specific style.`;

    console.log("Processing request with style:", style);

    // Initialize the Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemMessage}\n\nPost to reply to: ${lastMessage}` },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
