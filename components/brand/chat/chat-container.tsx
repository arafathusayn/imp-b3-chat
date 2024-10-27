"use client";

import { Check, CheckCheck, Loader2Icon, SendHorizontal } from "lucide-react";
import { useReducer } from "react";
import { useQuery } from "react-query";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMockChatMessages } from "@/lib/mocks";
import { chatReducer, initialState, Message } from "./reducer";

export default function ChatContainer() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isLoading } = useQuery({
    queryKey: ["chatMessages"],
    queryFn: getMockChatMessages,
    onSuccess: (data) => {
      // TODO: use better pattern
      dispatch({ type: "SET_INITIAL_MESSAGES", payload: data });
    },
    onError: (error) => {
      // TODO: Handle error
      console.error(error);
    },
  });

  const handleSend = () => {
    if (state.newMessage.trim()) {
      const newMessage: Message = {
        id: state.messages.length + 1,
        text: state.newMessage,
        sender: "user",
        name: "John Doe",
        timestamp: new Date().toISOString(),
        delivered: true,
        seen: false,
      };

      dispatch({ type: "ADD_MESSAGE", payload: newMessage });
      dispatch({ type: "SET_CHAT_INPUT", payload: "" });
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffDays = now.getDate() - date.getDate();

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col mb-4 ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center mb-1">
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage
                      src={
                        message.sender === "user"
                          ? "https://i.pravatar.cc/100?u=user"
                          : "https://i.pravatar.cc/100?u=bot"
                      }
                      alt={message.name}
                    />
                  </Avatar>
                  <span className="text-sm font-medium">{message.name}</span>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    {formatTimestamp(new Date(message.timestamp))}
                  </span>
                  {message.sender === "user" &&
                    (message.seen ? (
                      <CheckCheck className="h-4 w-4 text-primary" />
                    ) : message.delivered ? (
                      <Check className="h-4 w-4 text-muted-foreground" />
                    ) : null)}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={state.newMessage}
              onChange={(e) =>
                dispatch({
                  type: "SET_CHAT_INPUT",
                  payload: e.target.value,
                })
              }
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
