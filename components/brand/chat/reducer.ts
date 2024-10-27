export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  name: string;
  timestamp: string;
  delivered?: boolean;
  seen?: boolean;
};

export type ChatState = {
  messages: Message[];
  newMessage: string;
};

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_CHAT_INPUT"; payload: string }
  | { type: "MARK_DELIVERED"; payload: number }
  | { type: "MARK_SEEN"; payload: number }
  | { type: "SET_INITIAL_MESSAGES"; payload: Message[] };

export const initialState: ChatState = {
  messages: [],
  newMessage: "",
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_CHAT_INPUT":
      return {
        ...state,
        newMessage: action.payload,
      };
    case "MARK_DELIVERED":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload
            ? { ...message, delivered: true }
            : message,
        ),
      };
    case "MARK_SEEN":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload ? { ...message, seen: true } : message,
        ),
      };
    case "SET_INITIAL_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    default: {
      action satisfies never;
      return state;
    }
  }
}
