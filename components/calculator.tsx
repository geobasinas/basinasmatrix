"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixInput } from "@/components/matrix-input";
import { MatrixOperations } from "@/components/matrix-operations";
import { MatrixVisualization } from "@/components/matrix-visualization";
import { SavedCalculations } from "@/components/saved-calculations";
import { Matrix, ComplexMatrix } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Calculator() {
  const [matrixA, setMatrixA] = useState<Matrix>([[null]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[null]]);
  const [result, setResult] = useState<Matrix | ComplexMatrix | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedMatrices = localStorage.getItem("savedMatrices");
    if (savedMatrices) {
      const { matrixA: savedA, matrixB: savedB } = JSON.parse(savedMatrices);
      setMatrixA(savedA);
      setMatrixB(savedB);
    }
  }, []);

  const handleSave = () => {
    if (result) {
      const calculations = JSON.parse(localStorage.getItem("calculations") || "[]");
      calculations.push({
        id: Date.now(),
        matrixA,
        matrixB,
        result,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("calculations", JSON.stringify(calculations));
      toast({
        title: "Calculation saved",
        description: "Your calculation has been saved to local storage.",
      });
    }
  };

  const handleLoadMatrices = (newMatrixA: Matrix, newMatrixB: Matrix) => {
    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
    toast({
      title: "Matrices loaded",
      description: "The saved matrices have been loaded into the calculator.",
    });
  };

  const handleTabChange = (value: string) => {
    if (value === "operations") {
      const hasEmptyCells = matrixA.some(row => row.some(cell => cell === null)) ||
                           matrixB.some(row => row.some(cell => cell === null));
      setShowWarning(hasEmptyCells);
    } else {
      setShowWarning(false);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="input" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="visualization">View</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MatrixInput
              label="Matrix A"
              matrix={matrixA}
              onChange={setMatrixA}
            />
            <MatrixInput
              label="Matrix B"
              matrix={matrixB}
              onChange={setMatrixB}
            />
          </div>
        </TabsContent>

        <TabsContent value="operations">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {showWarning && (
              <div className="lg:col-span-2">
              <Alert variant="destructive" className="relative">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Empty cells will be treated as zeros during calculations.</AlertDescription>
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive/20"
                onClick={() => setShowWarning(false)}
                >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
                </Button>
              </Alert>
              </div>
            )}
            <MatrixOperations
              matrixA={matrixA}
              matrixB={matrixB}
              onResult={setResult}
              onError={setError}
              onSave={handleSave}
            />
            <div className="lg:col-span-2 space-y-4">
              {error && (
              <Alert variant="destructive" className="relative">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive/20"
                onClick={() => setError(null)}
                >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
                </Button>
              </Alert>
              )}
              {result && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Result:</h3>
                  <MatrixVisualization matrix={result} />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visualization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Matrix A</h3>
              <MatrixVisualization matrix={matrixA} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Matrix B</h3>
              <MatrixVisualization matrix={matrixB} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <SavedCalculations onLoad={handleLoadMatrices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}