import Registerr from "@/components/register"
export default async function Register(){
    return(
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center md:flex-row md:items-center md:justify-center gap-4 md:gap-12 lg:gap-20 px-4">
            <div className="flex flex-col items-center text-center py-8 md:py-0 md:items-start md:text-left max-w-md">
                <h1 className="text-white text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">Join NexChat</h1>
                <p className="text-white/40 text-sm py-4 md:py-5 leading-relaxed">Create an account to start messaging people and groups in seconds.</p>
            </div>
            <Registerr/>
        </div>
    )
}
