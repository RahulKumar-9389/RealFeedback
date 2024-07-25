"use client"


import Globe from "@/components/magicui/globe";
import { MoveRight } from 'lucide-react';
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useRouter } from "next/navigation";

const Home = () => {

  const router = useRouter();

  return <>
    <div className="container flex items-center justify-around max-w-screen h-[89vh] overflow-hidden">

      <div className="h-full flex items-start justify-center overflow-hidden flex-1 flex-col">
        <h1 className="text-6xl font-bold">Feedback Made Simple!</h1>
        <p className="mt-2 text-gray-300">Welcome to RealFeedback, where gathering feedback is as easy as sharing a link. Whether you're validating an idea, testing a product, or seeking customer insights, our platform simplifies the process. Simply create an account, share the link, and get the feedback from the world.</p>
        <ShimmerButton className="shadow-2xl mt-4" onClick={() => router.replace('/login')}>
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center gap-1">
            See How It Works
            <MoveRight className="ml-2 h-5 w-5" />
          </span>
        </ShimmerButton>
      </div>

      <div className="relative flex-1 h-full flex items-center justify-center">
        <Globe className="h-[550px] w-[550px] top-5" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

    </div>
  </>
};

export default Home;