import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";


export default function Home() {
  return (
      <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-50">
        <Header />
      </div>
      <Hero />
      
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 right-[-200px] h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-200px] left-1/2 h-[500px] w-[500px] bg-orange-400/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
