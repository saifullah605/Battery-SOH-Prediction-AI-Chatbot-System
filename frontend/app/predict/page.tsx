'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import * as XLSX from 'xlsx'

export default function PredictionPage() {
  const router = useRouter()

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<any[] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  const convertExcelToModelJSON = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    let dataRows = rows
    if (rows.length > 0 && String(rows[0][0]).toUpperCase() === 'U1')
      dataRows = rows.slice(1)

    const values = dataRows.map((row) => {
      const obj: Record<string, number> = {}
      for (let i = 0; i < 21; i++) obj[`U${i + 1}`] = Number(row[i] ?? 0)
      return obj
    })

    return { values }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFileName(file.name)
    setPredictions(null)
    setShowResults(false)
    setLoading(true)

    try {
      const formattedJSON = await convertExcelToModelJSON(file)
      const response = await fetch('http://localhost:8080/api/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedJSON),
      })

      const result = await response.json()
      setPredictions(result)
      setShowResults(true)
    } catch (error) {
      console.error('Error:', error)
      setPredictions([{ 'Predicted Health': false, 'Predicted SOH': 0, error: true }])
      setShowResults(true)
    }

    setLoading(false)
  }

  return (

      <div
        className="
          relative min-h-screen w-full px-6 py-20
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          text-white flex flex-col items-center justify-start
        "
      >
        {/* Back Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Hidden Input */}
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Main Card */}
        <div
          className="
            max-w-2xl w-full p-10 rounded-xl
            bg-slate-800/40 border border-slate-700 shadow-lg space-y-8
          "
        >
          <h1 className="text-3xl font-bold text-center">SOH Prediction Tool</h1>

          <p className="text-center text-slate-300">
            Upload an Excel file containing 21 voltage readings per row (U1–U21).
          </p>

          {/* ⭐ Predict Button inside card ⭐ */}
          <div className="flex justify-center">
            <button
              onClick={() => document.getElementById('excel-upload')?.click()}
              className="
                px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700
                text-white text-lg font-semibold shadow-lg transition
              "
            >
              Predict
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-blue-400 animate-pulse text-lg">
              Processing Excel file...
            </div>
          )}

          {/* Results */}
          {showResults && predictions && (
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">Prediction Results</h2>
              <div className="space-y-3">
                {predictions.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-slate-900/40 border border-slate-700"
                  >
                    <p className="text-lg">
                      <span className="font-semibold">Row {index + 1} — Health:</span>{' '}
                      {item['Predicted Health'] ? (
                        <span className="text-emerald-400 font-bold">Healthy</span>
                      ) : (
                        <span className="text-red-400 font-bold">Unhealthy</span>
                      )}
                    </p>
                    <p className="text-lg mt-1">
                      <span className="font-semibold">SOH: </span>
                      {(item['Predicted SOH'] * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div
          className="
            fixed bottom-0 left-0 w-full px-6 py-4
            bg-black/30 backdrop-blur-lg border-t border-slate-700
            flex items-center justify-between
          "
        >
          <div className="text-sm text-slate-300">
            {uploadedFileName ? <>📄 {uploadedFileName}</> : <>No file uploaded</>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => document.getElementById('excel-upload')?.click()}
              className="
                px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600
                transition text-white font-medium shadow-md
              "
            >
              Upload Excel
            </button>
          </div>
        </div>
      </div>

  )
}
