export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, style } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const systemMessage = `You are a nigerian social media expert that generates suggested replies to posts.
    The user will provide a post they want to reply to, and you should generate a reply in the style: "${style}".
    Your response should be a direct reply to the post content, as if the user is responding to someone else's post.
    Keep your response concise and tweet-length (under 280 characters when possible).
    Make the reply engaging, relevant to the post content, and authentic to the specified style.
    Do not mention that you are an AI or that you're responding in a specific style.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemMessage}\n\nPost to reply to: ${lastMessage}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error details:", errorData);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Add proper error handling for missing data
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected Gemini API response format:", data);
      throw new Error("Unexpected response format from Gemini API");
    }

    const reply = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ reply }), {
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
