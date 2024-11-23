import { Calculator } from "@/components/calculator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calculator as CalcIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CalcIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Matrix Calculator</h1>
          </div>
          <ThemeToggle />
        </header>
        <Calculator />
      </div>
    </main>
  );
}