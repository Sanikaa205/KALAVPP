import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "kalavpp-secret-key-change-in-production",
  });

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = JSON.stringify({
        type: "connected",
        message: "SSE connection established",
        userId: token.id,
        role: token.role,
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));

      // Keep-alive ping every 30 seconds
      const interval = setInterval(() => {
        try {
          const ping = JSON.stringify({
            type: "ping",
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${ping}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 30000);

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
