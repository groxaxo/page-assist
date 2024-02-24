import { create } from "zustand"

type WebSearch = {
  search_engine: string
  search_url: string
  search_query: string
  search_results: {
    title: string
    link: string
  }[]
}
export type Message = {
  isBot: boolean
  name: string
  message: string
  sources: any[]
  images?: string[]
  search?: WebSearch
}

export type ChatHistory = {
  role: "user" | "assistant" | "system"
  content: string
  image?: string
}[]

type State = {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  history: ChatHistory
  setHistory: (history: ChatHistory) => void
  streaming: boolean
  setStreaming: (streaming: boolean) => void
  isFirstMessage: boolean
  setIsFirstMessage: (isFirstMessage: boolean) => void
  historyId: string | null
  setHistoryId: (history_id: string | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  selectedModel: string | null
  setSelectedModel: (selectedModel: string) => void
  chatMode: "normal" | "rag"
  setChatMode: (chatMode: "normal" | "rag") => void
  isEmbedding: boolean
  setIsEmbedding: (isEmbedding: boolean) => void
  speechToTextLanguage: string
  setSpeechToTextLanguage: (language: string) => void
}

export const useStoreMessageOption = create<State>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  history: [],
  setHistory: (history) => set({ history }),
  streaming: false,
  setStreaming: (streaming) => set({ streaming }),
  isFirstMessage: true,
  setIsFirstMessage: (isFirstMessage) => set({ isFirstMessage }),
  historyId: null,
  setHistoryId: (historyId) => set({ historyId }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  speechToTextLanguage: "en-US",
  setSpeechToTextLanguage: (language) =>
    set({ speechToTextLanguage: language }),
  selectedModel: null,
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  chatMode: "normal",
  setChatMode: (chatMode) => set({ chatMode }),
  isEmbedding: false,
  setIsEmbedding: (isEmbedding) => set({ isEmbedding })
}))
