'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import * as XLSX from "xlsx";

export default function PredictionPage() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<any[] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  // --------------------------------------------
  // Convert Excel -> EXACT U1..U21 JSON Format
  // --------------------------------------------
  const convertExcelToModelJSON = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Read raw rows (arrays)
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // If first row is header (U1), skip it
    let dataRows = rows;
    if (rows.length > 0 && String(rows[0][0]).toUpperCase() === "U1") {
      dataRows = rows.slice(1);
    }

    const values = dataRows.map((row) => {
      let obj: Record<string, number> = {};

      // Extract EXACTLY 21 values per row
      for (let i = 0; i < 21; i++) {
        obj[`U${i + 1}`] = Number(row[i] ?? 0);
      }

      return obj;
    });

    return { values };
  };

  // --------------------------------------------
  // Handle file upload + API call
  // --------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setPredictions(null);
    setShowResults(false);
    setLoading(true);

    try {
      const formattedJSON = await convertExcelToModelJSON(file);

      console.log("➡️ JSON sent to backend:", formattedJSON);

      const response = await fetch("http://localhost:8080/api/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedJSON),
      });

      const result = await response.json();

      // RESULT IS AN ARRAY
      setPredictions(result);
      setShowResults(true);

    } catch (error) {
      console.error("Error:", error);
      setPredictions([
        { "Predicted Health": false, "Predicted SOH": 0, error: true }
      ]);
      setShowResults(true);
    }

    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="relative flex h-screen w-full items-center justify-center
                      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                      text-white px-6">

        {/* Hidden File Input */}
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* MAIN CARD */}
        <div className="max-w-2xl w-full p-10 rounded-xl bg-slate-800/40 
                        border border-slate-700 shadow-lg space-y-8">

          <h1 className="text-3xl font-bold text-center">SOH Prediction Tool</h1>

          <p className="text-center text-slate-300">
            Upload an Excel file containing 21 voltage readings per row (U1–U21).
          </p>

          {loading && (
            <div className="text-center text-blue-400 animate-pulse text-lg">
              Processing Excel file...
            </div>
          )}

          {/* RESULTS */}
          {showResults && predictions && (
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">Prediction Results</h2>

              <div className="space-y-3">
                {predictions.map((item, index) => (
                  <div key={index}
                       className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                    
                    <p className="text-lg">
                      <span className="font-semibold">Row {index + 1} — Health:</span>{" "}
                      {item["Predicted Health"] ? (
                        <span className="text-emerald-400 font-bold">Healthy</span>
                      ) : (
                        <span className="text-red-400 font-bold">Unhealthy</span>
                      )}
                    </p>

                    <p className="text-lg mt-1">
                      <span className="font-semibold">SOH:</span>{" "}
                      {(item["Predicted SOH"] * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ⭐ Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full px-6 py-4 
                        bg-black/30 backdrop-blur-lg border-t border-slate-700 
                        flex items-center justify-between">

          {/* File Name */}
          <div className="text-sm text-slate-300">
            {uploadedFileName ? (
              <>📄 <span className="font-medium">{uploadedFileName}</span></>
            ) : (
              <>No file uploaded</>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => document.getElementById("excel-upload")?.click()}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600
                         transition text-white font-medium shadow-md"
            >
              Upload Excel
            </button>

            
          </div>
        </div>

      </div>
    </ProtectedRoute>
  )
}
