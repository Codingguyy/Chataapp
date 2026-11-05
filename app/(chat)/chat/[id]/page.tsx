import Groupordmchat from "@/components/groupordmchat"
export default async function Chatindividual(){
   return(
      <div className="h-full w-full flex flex-col items-stretch justify-start sm:w-[68%] bg-[#0a0a0a]" style={{fontFamily:"'Robotomono',monospace"}}>
         <Groupordmchat/>
      </div>
   )
}
