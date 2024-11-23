import { Matrix, ComplexMatrix } from "@/lib/types";

interface MatrixVisualizationProps {
  matrix: Matrix | ComplexMatrix;
}

export function MatrixVisualization({ matrix }: MatrixVisualizationProps) {
  const formatValue = (value: number | [number, number] | null): string => {
    if (value === null) return "0.00";
    if (Array.isArray(value)) {
      const [real, imag] = value;
      return `${real.toFixed(2)}${imag >= 0 ? "+" : ""}${imag.toFixed(2)}i`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block border border-border rounded-lg p-4">
        <div className="grid gap-2">
          {matrix.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-muted rounded-md"
                >
                  <span className="text-xs sm:text-sm font-mono break-all px-1">
                    {formatValue(cell)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}