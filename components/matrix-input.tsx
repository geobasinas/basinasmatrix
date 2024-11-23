"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, X } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Matrix } from "@/lib/types";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface MatrixInputProps {
  label: string;
  matrix: Matrix;
  onChange: (matrix: Matrix) => void;
}

export function MatrixInput({ label, matrix, onChange }: MatrixInputProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [autoFillZeros, setAutoFillZeros] = useState(false);
  const rows = matrix.length;
  const cols = matrix[0].length;

  const addRow = () => {
    const newMatrix = [...matrix, Array(cols).fill(null)];
    onChange(newMatrix);
  };

  const removeRow = () => {
    if (rows > 1) {
      const newMatrix = matrix.slice(0, -1);
      onChange(newMatrix);
    }
  };

  const addColumn = () => {
    const newMatrix = matrix.map(row => [...row, null]);
    onChange(newMatrix);
  };

  const removeColumn = () => {
    if (cols > 1) {
      const newMatrix = matrix.map(row => row.slice(0, -1));
      onChange(newMatrix);
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newMatrix = matrix.map((row, i) =>
      row.map((cell, j) => {
        if (i === rowIndex && j === colIndex) {
          return value === "" ? null : Number(value);
        }
        return cell;
      })
    );
    onChange(newMatrix);
    
    if (!autoFillZeros) {
      setShowWarning(newMatrix.some(row => row.some(cell => cell === null)));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (colIndex === cols - 1) {
        if (rowIndex === rows - 1) {
          addRow();
        }
        const nextRow = rowIndex + 1;
        if (nextRow < rows) {
          document.querySelector<HTMLInputElement>(
            `input[data-position="${nextRow}-0"]`
          )?.focus();
        }
      } else {
        document.querySelector<HTMLInputElement>(
          `input[data-position="${rowIndex}-${colIndex + 1}"]`
        )?.focus();
      }
    }
  };

  const handleBlur = () => {
    if (autoFillZeros) {
      const hasEmptyCells = matrix.some(row => 
        row.some(cell => cell === null)
      );

      if (hasEmptyCells) {
        const newMatrix = matrix.map(row =>
          row.map(cell => cell === null ? 0 : cell)
        );
        onChange(newMatrix);
        setShowWarning(false);
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Label className="text-lg font-semibold">{label}</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addRow}
              className="w-full flex items-center justify-center gap-1 min-h-10"
            >
              <Plus className="h-4 w-4" /> Row
            </Button>
            {rows > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeRow}
                className="w-full flex items-center justify-center gap-1 min-h-10"
              >
                <Minus className="h-4 w-4" /> Row
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addColumn}
              className="w-full flex items-center justify-center gap-1 min-h-10"
            >
              <Plus className="h-4 w-4" /> Column
            </Button>
            {cols > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeColumn}
                className="w-full flex items-center justify-center gap-1 min-h-10"
              >
                <Minus className="h-4 w-4" /> Column
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {showWarning && (
        <div className="relative bg-destructive/15 text-destructive rounded-lg p-4">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm flex-auto">Empty cells will be treated as zeros during calculations.</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-destructive/20"
            onClick={() => setShowWarning(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-2">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-2 items-center">
                {row.map((cell, j) => (
                  <Input
                    key={`${i}-${j}`}
                    type="number"
                    inputMode="decimal"
                    data-position={`${i}-${j}`}
                    value={cell === null ? "" : cell}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                    onBlur={handleBlur}
                    placeholder="0"
                    className="w-16 h-12 text-center text-base touch-manipulation"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Label htmlFor="auto-fill" className="text-sm text-muted-foreground">
          Auto-fill zeros
        </Label>
        <Switch
          id="auto-fill"
          checked={autoFillZeros}
          onCheckedChange={setAutoFillZeros}
        />
      </div>
    </div>
  );
}