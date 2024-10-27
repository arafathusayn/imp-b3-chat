"use client";

import { QueryClientProvider } from "react-query";

import { queryClient } from "@/lib/store";
import ChatContainer from "./chat-container";

export function ChatProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContainer />
    </QueryClientProvider>
  );
}
