import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black">
      
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-white font-bold text-4xl">"Ace Your Next Interview with AI-Powered Mock Sessions"</h1>
      <img src="/iTECH-Dysart-1200.jpg" alt="Centered Image" className="max-w-full h-auto" />
      <Link href={'/dashboard'}>
      <Button className="bg-slate-50 text-black w-48 hover:bg-slate-300" >Start</Button>
      </Link>
    </div>
    </div>
  );
}
