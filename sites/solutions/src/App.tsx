import { Button } from "./components/ui/button";
import { MailIcon } from "lucide-react";
import "./index.css";
import { LightRays } from "@/components/ui/light-rays";
import { useState, useEffect } from "react";

const solutions = [
  "Bussiness Software",
  "Internal Tools",
  "SaaS",
  "AI",
  "Website",
]

export function App() {
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentSolutionIndex((prev) => (prev + 1) % solutions.length);
        setIsVisible(true);
      }, 500); // Half of the fade duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark relative text-foreground min-h-screen bg-background">
      <LightRays />
      <div className="relative min-h-[calc(100vh)] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Zodula Solutions</h1>
          <div className="flex gap-2 items-center whitespace-nowrap">
            <span>The only solution you need for </span>
            <span className="relative inline-block min-w-[110px] text-center">
              <span
                className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                {solutions[currentSolutionIndex]}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => window.open("mailto:solutions@zodula.dev", "_blank")}>
              <MailIcon />
              <span>Contact Us</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex justify-between w-full p-4">
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Zodula. All rights reserved.</span>
        </div>
        <div className="flex justify-center gap-2 text-sm font-mono">
          <a href="mailto:solutions@zodula.dev" target="_blank" className="hover:underline">
            solutions@zodula.dev
          </a>
          or
          <a href="https://zodula.dev/" target="_blank" className="hover:underline">
            Framework
          </a>
        </div>
      </div>
    </div >
  );
}

export default App;
