"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SSEMessage {
  type: string;
  message?: string;
  timestamp: string;
  [key: string]: unknown;
}

export function useSSE(enabled = true) {
  const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource("/api/sse");
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data);
        setLastMessage(data);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (enabled) connect();
      }, 5000);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    connect();

    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [enabled, connect]);

  return { lastMessage, connected };
}
