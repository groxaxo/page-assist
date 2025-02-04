import { KokoroVoice } from "kokoro-ts/src/types"
import OpenAI from "openai"

import { stream } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const DEFAULT_TTS_PROVIDER = "browser"

const AVAILABLE_TTS_PROVIDERS = ["browser", "elevenlabs", "kokoro"] as const

export const getTTSProvider = async (): Promise<
  (typeof AVAILABLE_TTS_PROVIDERS)[number]
> => {
  const ttsProvider = await storage.get("ttsProvider")
  if (!ttsProvider || ttsProvider.length === 0) {
    return DEFAULT_TTS_PROVIDER
  }
  return ttsProvider as (typeof AVAILABLE_TTS_PROVIDERS)[number]
}

export const setTTSProvider = async (ttsProvider: string) => {
  await storage.set("ttsProvider", ttsProvider)
}

export const getBrowserTTSVoices = async () => {
  if (import.meta.env.BROWSER === "chrome") {
    const tts = await chrome.tts.getVoices()
    return tts
  } else {
    const tts = await speechSynthesis.getVoices()
    return tts.map((voice) => ({
      voiceName: voice.name,
      lang: voice.lang
    }))
  }
}

export const getVoice = async () => {
  const voice = await storage.get("voice")
  return voice
}

export const setVoice = async (voice: string) => {
  await storage.set("voice", voice)
}

export const isTTSEnabled = async () => {
  const data = await storage.get("isTTSEnabled")
  if (!data || data.length === 0) {
    return true
  }
  return data === "true"
}

export const setTTSEnabled = async (isTTSEnabled: boolean) => {
  await storage.set("isTTSEnabled", isTTSEnabled.toString())
}

export const isSSMLEnabled = async () => {
  const data = await storage.get("isSSMLEnabled")
  return data === "true"
}

export const setSSMLEnabled = async (isSSMLEnabled: boolean) => {
  await storage.set("isSSMLEnabled", isSSMLEnabled.toString())
}

export const getElevenLabsApiKey = async () => {
  const data = await storage.get("elevenLabsApiKey")
  return data
}

export const setElevenLabsApiKey = async (elevenLabsApiKey: string) => {
  await storage.set("elevenLabsApiKey", elevenLabsApiKey)
}

export const getElevenLabsVoiceId = async () => {
  const data = await storage.get("elevenLabsVoiceId")
  return data
}

export const setElevenLabsVoiceId = async (elevenLabsVoiceId: string) => {
  await storage.set("elevenLabsVoiceId", elevenLabsVoiceId)
}

export const getElevenLabsModel = async () => {
  const data = await storage.get("elevenLabsModel")
  return data
}

export const setElevenLabsModel = async (elevenLabsModel: string) => {
  await storage.set("elevenLabsModel", elevenLabsModel)
}

export const getKokoroApiKey = async () => {
  const data = await storage.get("kokoroApiKey")
  return data
}

export const setKokoroApiKey = async (kokoroApiKey: string) => {
  await storage.set("kokoroApiKey", kokoroApiKey)
}

export const getKokoroVoiceId = async () => {
  const data = await storage.get("kokoroVoiceId")
  return data
}

export const setKokoroVoiceId = async (kokoroVoiceId: string) => {
  await storage.set("kokoroVoiceId", kokoroVoiceId)
}

export const getKokoroApiUrl = async () => {
  const data = await storage.get("kokoroApiUrl")
  return data
}

export const setKokoroApiUrl = async (kokoroApiUrl: string) => {
  await storage.set("kokoroApiUrl", kokoroApiUrl)
}

export const streamKokoroTTS = async (input: string, voice: string) => {
  try {
      const apiUrl = await getKokoroApiUrl()
    const client = new OpenAI({
        baseURL: `${apiUrl}/v1`,
        apiKey: "not-needed",
      dangerouslyAllowBrowser: true
    })
    const response = await client.audio.speech.withResponse().create({
      model: "kokoro",
      voice: voice,
      input: input
    })
    return response.body
  } catch (error) {
    console.error("Error streaming Kokoro TTS:", error)
  }
}


export const generateTTSStream = async (input: string, voice: string) => {
  const ttsProvider = await getTTSProvider()
  
  switch (ttsProvider) {
    case "kokoro":
        return await streamKokoroTTS(input, voice)
    default:
        if (import.meta.env.BROWSER === "chrome") {
    const tts = await chrome.tts.speak(input, {
      voiceName: voice,
      rate: 1.2
    })
    return tts
  } else {
    const tts = new SpeechSynthesisUtterance(input)
    tts.voice = speechSynthesis
      .getVoices()
      .find((v) => v.name === voice)
    speechSynthesis.speak(tts)
  }
  }
      model: "kokoro",
export const getResponseSplitting = async () => {
  const data = await storage.get("ttsResponseSplitting")
  if (!data || data.length === 0 || data === "") {
    return "punctuation"
  }
  return data
}

export const setResponseSplitting = async (responseSplitting: string) => {
  await storage.set("ttsResponseSplitting", responseSplitting)
}

export const getTTSSettings = async () => {
  const [
    ttsEnabled,
    ttsProvider,
    browserTTSVoices,
    voice,
    ssmlEnabled,
    elevenLabsApiKey,
    elevenLabsVoiceId,
      elevenLabsModel,
      kokoroApiKey,
      kokoroVoiceId,
      kokoroApiUrl,
    responseSplitting
  ] = await Promise.all([
    isTTSEnabled(),
    getTTSProvider(),
    getBrowserTTSVoices(),
    getVoice(),
    isSSMLEnabled(),
    getElevenLabsApiKey(),
    getElevenLabsVoiceId(),
      getElevenLabsModel(),
      getKokoroApiKey(),
      getKokoroVoiceId(),
      getKokoroApiUrl(),
    getResponseSplitting()
  ])

  return {
    ttsEnabled,
    ttsProvider,
    browserTTSVoices,
    voice,
    ssmlEnabled,
    elevenLabsApiKey,
    elevenLabsVoiceId,
      kokoroApiKey,
      kokoroVoiceId,
      kokoroApiUrl,
    elevenLabsModel,
    responseSplitting
  }
}

export const setTTSSettings = async ({
  ttsEnabled,
  ttsProvider,
  voice,
  ssmlEnabled,
  elevenLabsApiKey,
  elevenLabsVoiceId,
    kokoroApiKey,
    kokoroVoiceId,
    kokoroApiUrl,
  elevenLabsModel,
  responseSplitting
}: {
  ttsEnabled: boolean
  ttsProvider: string
  voice: string
  ssmlEnabled: boolean
  elevenLabsApiKey: string
  elevenLabsVoiceId: string
    kokoroApiKey: string
    kokoroVoiceId: string
    kokoroApiUrl: string
  elevenLabsModel: string
  responseSplitting: string
}) => {
  await Promise.all([
    setTTSEnabled(ttsEnabled),
    setTTSProvider(ttsProvider),
    setVoice(voice),
    setSSMLEnabled(ssmlEnabled),
    setElevenLabsApiKey(elevenLabsApiKey),
    setElevenLabsVoiceId(elevenLabsVoiceId),
      setKokoroApiKey(kokoroApiKey),
      setKokoroVoiceId(kokoroVoiceId),
      setKokoroApiUrl(kokoroApiUrl),
    setElevenLabsModel(elevenLabsModel),
    setResponseSplitting(responseSplitting)
  ])
}

