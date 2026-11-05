"use server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { messageattachment } from "@/types/1to1conversations"

const ALLOWED_TYPES: Record<string, "pdf" | "jpg"> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
}
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8mb

export default async function Uploadattachment(formData: FormData): Promise<messageattachment | "Error"> {
    const file = formData.get("file") as File | null
    if (!file) {
        return "Error"
    }

    const filetype = ALLOWED_TYPES[file.type]
    if (!filetype) {
        return "Error"
    }
    if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
        return "Error"
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const isPdf = filetype === "pdf" && buffer.subarray(0, 5).toString() === "%PDF-"
        const isJpeg = filetype === "jpg" && buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
        if (!isPdf && !isJpeg) return "Error"
        const extension = filetype === "pdf" ? "pdf" : "jpg"
        const filename = `${crypto.randomUUID()}.${extension}`
        const uploadDirectory = path.join(process.cwd(), "public", "uploads")
        const uploadpath = path.join(uploadDirectory, filename)
        await mkdir(uploadDirectory, { recursive: true })
        await writeFile(uploadpath, buffer)

        return {
            url: `/uploads/${filename}`,
            type: filetype,
            name: file.name
        }
    } catch {
        return "Error"
    }
}
