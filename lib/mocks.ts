import { Message } from "@/components/brand/chat/reducer";
import mockedChatMessages from "@/data/mock-data/initial-chat-messages.json";
import { sleep } from "@/lib/utils";

export const chatMessages = mockedChatMessages as Message[];

export async function getMockChatMessages() {
  await sleep(3000);

  return chatMessages;
}
