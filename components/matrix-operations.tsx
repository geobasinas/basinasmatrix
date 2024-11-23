"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Matrix, ComplexMatrix } from "@/lib/types";
import * as math from "mathjs";

interface MatrixOperationsProps {
  matrixA: Matrix;
  matrixB: Matrix;
  onResult: (result: Matrix | ComplexMatrix) => void;
  onError: (error: string) => void;
  onSave: () => void;
}

export function MatrixOperations({
  matrixA,
  matrixB,
  onResult,
  onError,
  onSave,
}: MatrixOperationsProps) {
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [firstMatrix, setFirstMatrix] = useState<"A" | "B">("A");
  const [secondMatrix, setSecondMatrix] = useState<"A" | "B">("B");

  const binaryOperations = [
    { value: "add", label: "Addition (A + B)" },
    { value: "subtract", label: "Subtraction (A - B)" },
    { value: "multiply", label: "Multiplication (A × B)" },
  ];

  const unaryOperations = [
    { value: "determinant", label: "Determinant" },
    { value: "inverse", label: "Inverse" },
    { value: "transpose", label: "Transpose" },
    { value: "eigenvalues", label: "Eigenvalues" },
    { value: "echelon", label: "Echelon Form" },
  ];

  const prepareMatrix = (matrix: Matrix): number[][] => {
    return matrix.map(row => 
      row.map(cell => (cell === null ? 0 : cell))
    );
  };

  const validateMatrices = () => {
    const hasNull = (matrix: Matrix) => 
      matrix.some(row => row.some(cell => cell === null));

    if (hasNull(matrixA) || hasNull(matrixB)) {
      throw new Error("Please fill in all empty cells before performing operations");
    }
  };

  const handleOperation = () => {
    try {
      validateMatrices();
      const first = firstMatrix === "A" ? prepareMatrix(matrixA) : prepareMatrix(matrixB);
      const second = secondMatrix === "A" ? prepareMatrix(matrixA) : prepareMatrix(matrixB);
      
      let result;
      switch (selectedOperation) {
        case "add":
          if (first.length !== second.length || first[0].length !== second[0].length) {
            throw new Error("Matrices must have the same dimensions for addition");
          }
          result = math.add(first, second);
          break;
        case "subtract":
          if (first.length !== second.length || first[0].length !== second[0].length) {
            throw new Error("Matrices must have the same dimensions for subtraction");
          }
          result = math.subtract(first, second);
          break;
        case "multiply":
          if (first[0].length !== second.length) {
            throw new Error("Number of columns in first matrix must equal number of rows in second matrix");
          }
          result = math.multiply(first, second);
          break;
        case "determinant":
          if (first.length !== first[0].length) {
            throw new Error("Matrix must be square for determinant calculation");
          }
          const det = math.det(first);
          result = [[det]];
          break;
        case "inverse":
          if (first.length !== first[0].length) {
            throw new Error("Matrix must be square for inverse calculation");
          }
          const determinant = math.det(first);
          if (Math.abs(determinant) < 1e-10) {
            throw new Error("Matrix is not invertible (determinant is zero)");
          }
          result = math.inv(first);
          break;
        case "transpose":
          result = math.transpose(first);
          break;
        case "eigenvalues":
          if (first.length !== first[0].length) {
            throw new Error("Matrix must be square for eigenvalue calculation");
          }
          const eig = math.eigs(first);
          const eigenvalues = eig.values.map(v => [v.re, v.im]) as ComplexMatrix;
          result = eigenvalues;
          break;
        case "echelon":
          result = math.lup(first).U;
          break;
        default:
          throw new Error("Invalid operation");
      }
      onResult(result as Matrix | ComplexMatrix);
    } catch (error) {
      onError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const isBinaryOperation = (op: string) => 
    binaryOperations.some(bop => bop.value === op);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select Operation</Label>
          <Select
            value={selectedOperation}
            onValueChange={setSelectedOperation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Basic Operations</SelectLabel>
                {binaryOperations.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Advanced Operations</SelectLabel>
                {unaryOperations.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {selectedOperation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>First Matrix:</Label>
              <Select
                value={firstMatrix}
                onValueChange={(value: "A" | "B") => setFirstMatrix(value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isBinaryOperation(selectedOperation) && (
              <div className="flex items-center gap-2">
                <Label>Second Matrix:</Label>
                <Select
                  value={secondMatrix}
                  onValueChange={(value: "A" | "B") => setSecondMatrix(value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleOperation}
            >
              Calculate
            </Button>
          </div>
        )}
      </div>

      <Button onClick={onSave} className="w-full" variant="outline">
        Save Calculation
      </Button>
    </div>
  );
}