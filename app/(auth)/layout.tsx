import Image from "next/image";
import Backgroundimage from "@/images/Gemini_Generated_Image_x8g49gx8g49gx8g4.png"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">

      <Image
        src={Backgroundimage}
        alt="Background"
        fill
        className="object-cover -z-20 opacity-30"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]/40" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
