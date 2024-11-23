"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MatrixVisualization } from "@/components/matrix-visualization";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Matrix } from "@/lib/types";

interface SavedCalculation {
  id: number;
  matrixA: Matrix;
  matrixB: Matrix;
  result: Matrix;
  timestamp: string;
}

interface SavedCalculationsProps {
  onLoad?: (matrixA: Matrix, matrixB: Matrix) => void;
}

export function SavedCalculations({ onLoad }: SavedCalculationsProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("calculations");
    if (saved) {
      setCalculations(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: number) => {
    const newCalculations = calculations.filter((calc) => calc.id !== id);
    setCalculations(newCalculations);
    localStorage.setItem("calculations", JSON.stringify(newCalculations));
  };

  const handleClear = () => {
    setCalculations([]);
    localStorage.removeItem("calculations");
  };

  const handleLoad = (calc: SavedCalculation) => {
    if (onLoad) {
      onLoad(calc.matrixA, calc.matrixB);
    }
  };

  if (calculations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved calculations yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-8">
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleClear}>
            Clear All
          </Button>
        </div>
        {calculations.map((calc) => (
          <div
            key={calc.id}
            className="border border-border rounded-lg p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {new Date(calc.timestamp).toLocaleString()}
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoad(calc)}
                  className="flex-1 sm:flex-none"
                >
                  Load
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(calc.id)}
                  className="flex-1 sm:flex-none"
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Matrix A</h4>
                <MatrixVisualization matrix={calc.matrixA} />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Matrix B</h4>
                <MatrixVisualization matrix={calc.matrixB} />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Result</h4>
                <MatrixVisualization matrix={calc.result} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}