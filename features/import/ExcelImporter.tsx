"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useMapStore, Point } from "@/stores/useMapStore";
import PointConfirmDialog from "@/components/points/PointConfirmDialog";
import { toast } from "sonner";

type ParsedResult = {
  points: Point[];
  headers: string[]; 
  errors: string[];
};

export default function ExcelImporter() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { addPoints, setPoints } = useMapStore();

  function openPicker() {
    fileRef.current?.click();
  }

  function normalizeKey(key: string) {
    return key.trim().toLowerCase();
  }

  function findLatLngKeys(normalizedRow: Record<string, unknown>) {
    const latKeys = ["lat", "latitude", "y"];
    const lngKeys = ["lng", "lon", "long", "longitude", "x"];

    const latKey = latKeys.find(k => k in normalizedRow);
    const lngKey = lngKeys.find(k => k in normalizedRow);

    return { latKey, lngKey };
  }

  function guessNameKey(headers: string[]): string | undefined {
    const priority = ["name", "title", "site", "id", "label"];
    const normalized = headers.map(h => ({ orig: h, norm: normalizeKey(h) }));

    for (const p of priority) {
      const match = normalized.find(h => h.norm.includes(p));
      if (match) return match.orig;
    }
    return headers[0]; // fallback to first column
  }

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("No sheet found.");

      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) throw new Error("Sheet is empty.");

      // Get original headers from first row
      const originalHeaders = Object.keys(rows[0]);

      const errors: string[] = [];
      const points = rows
       .map((rawRow, idx) => {
          // Keep original keys for meta, but also make normalized copy for lat/lng lookup
          const normalized: Record<string, unknown> = {};
          for (const key in rawRow) {
            normalized[normalizeKey(key)] = rawRow[key];
          }

          const { latKey, lngKey } = findLatLngKeys(normalized);
          if (!latKey ||!lngKey) {
            errors.push(`Row ${idx + 2}: Missing lat/lng columns`);
            return null;
          }

          const lat = parseFloat(String(normalized[latKey]));
          const lng = parseFloat(String(normalized[lngKey]));

          if (!Number.isFinite(lat) ||!Number.isFinite(lng)) {
            errors.push(`Row ${idx + 2}: Invalid lat/lng`);
            return null;
          }
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            errors.push(`Row ${idx + 2}: Lat/lng out of range`);
            return null;
          }

          // Dump everything into meta, keep original casing/keys
          const meta: Record<string, unknown> = {};
          for (const key in rawRow) {
            if (String(rawRow[key]).trim()!== "") {
              meta[key] = rawRow[key];
            }
          }

          return {
            id: crypto.randomUUID(),
            lat,
            lng,
            name: `Point ${idx + 1}`, // temp name, user will pick field in dialog
            createdAt: Date.now(),
            meta,
          } satisfies Point;
        })
       .filter((p): p is Point => p!== null);

      if (points.length === 0) throw new Error("No valid coordinates found.");

      setParsedData({
        points,
        headers: originalHeaders,
        errors,
      });
      setDialogOpen(true);
    } catch (err) {
      console.error("Import failed:", err);
      toast.error(err instanceof Error? err.message : "Failed to read file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <button
        onClick={openPicker}
        disabled={loading}
        className="px-4 py-2 cursor-pointer rounded-lg bg-emerald-500 text-white disabled:bg-emerald-300"
      >
        {loading? "Reading file..." : "Import Excel/CSV"}
      </button>

      {parsedData && (
        <PointConfirmDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          points={parsedData.points}
          headers={parsedData.headers}
          errors={parsedData.errors}
          suggestedNameKey={guessNameKey(parsedData.headers)}
          onAdd={addPoints}
          onReplace={setPoints}
        />
      )}
    </>
  );
}