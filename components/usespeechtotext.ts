"use client"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

// Minimal ambient typings for the Web Speech API — not in standard TS DOM lib yet.
interface SpeechRecognitionResultLike {
    isFinal: boolean
    0: { transcript: string }
}
interface SpeechRecognitionEventLike extends Event {
    resultIndex: number
    results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionLike extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    start: () => void
    stop: () => void
    onresult: ((event: SpeechRecognitionEventLike) => void) | null
    onerror: ((event: any) => void) | null
    onend: (() => void) | null
}

export default function Usespeechtotext(oncommit: (finalchunk: string) => void) {
    const [islistening, setislistening] = useState(false)
    const recognitionref = useRef<SpeechRecognitionLike | null>(null)
    const oncommitref = useRef(oncommit)

    useEffect(() => { oncommitref.current = oncommit }, [oncommit])

    function getrecognitionctor(): (new () => SpeechRecognitionLike) | null {
        if (typeof window === "undefined") return null
        const w = window as any
        return w.SpeechRecognition || w.webkitSpeechRecognition || null
    }

    function start() {
        const Ctor = getrecognitionctor()
        if (!Ctor) {
            toast.error("Voice input isn't supported in this browser")
            return
        }
        if (islistening) return

        const recognition = new Ctor()
        recognition.lang = "en-US"
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
            let finaltranscript = ""
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finaltranscript += result[0].transcript
                }
            }
            if (finaltranscript.trim()) {
                oncommitref.current(finaltranscript.trim())
            }
        }
        recognition.onerror = (event) => {
            if (event?.error !== "no-speech") {
                toast.error("Voice input error, please try again")
            }
            setislistening(false)
        }
        recognition.onend = () => {
            setislistening(false)
        }

        recognitionref.current = recognition
        recognition.start()
        setislistening(true)
    }

    function stop() {
        recognitionref.current?.stop()
        setislistening(false)
    }

    function toggle() {
        if (islistening) stop()
        else start()
    }

    useEffect(() => {
        return () => {
            recognitionref.current?.stop()
        }
    }, [])

    return { islistening, start, stop, toggle }
}
