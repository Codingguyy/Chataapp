import Loginn from "@/components/login"
export default async function Login(){
    return(
       <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center md:flex-row md:items-center md:justify-center gap-4 md:gap-12 lg:gap-20 px-4">
        <div className="flex flex-col items-center text-center py-8 md:py-0 md:items-start md:text-left md:px-0 lg:px-0 max-w-md">
            <h1 className="text-3xl text-white font-semibold tracking-tight md:text-4xl lg:text-5xl">Welcome back</h1>
            <p className="text-white/40 text-sm py-4 md:py-5 leading-relaxed">Sign in to pick up your conversations right where you left off.</p>
        </div>
        <Loginn/>
       </div>
    )
}
