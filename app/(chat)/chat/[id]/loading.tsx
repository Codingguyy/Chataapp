import { Spinner } from "@/components/ui/spinner"
export default async function Loading(){
    return(
     <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a]">
        <Spinner/>
     </div>
    )
}
