"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useMapStore, Point } from "@/stores/useMapStore";
import PointConfirmDialog from "@/components/ui/PointConfirmDialog";

export default function ExcelImporter() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedPoints, setUploadedPoints] = useState<Point[]>([]);

  const { addPoints, setPoints } = useMapStore();

  function openPicker() {
    fileRef.current?.click();
  }

  function getValue(
    row: Record<string, unknown>,
    ...keys: string[]
  ): string | undefined {
    for (const k of keys) {
      const v = row[k];
      if (typeof v === "string" || typeof v === "number") {
        return String(v);
      }
    }
    return undefined;
  }

  async function handleFile(file: File) {
    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        alert("No sheet found.");
        return;
      }

      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const parsed: Point[] = rows
        .map((row) => {
          const lat = parseFloat(
            getValue(row, "lat", "Lat", "latitude", "Latitude") ?? "",
          );

          const lng = parseFloat(
            getValue(row, "lng", "Lng", "longitude", "Longitude") ?? "",
          );

          const name = getValue(
            row,
            "ihs site id",
            "IHS Site ID",
            'IHS SITE ID',
            "site id",
            "Site ID",
            "name",
            "Name",
          );

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return null;
          }

          return {
            id: crypto.randomUUID(),
            lat,
            lng,
            name,
            createdAt: Date.now(),
          };
        })
        .filter((p): p is Point => p !== null);

      if (parsed.length === 0) {
        alert("No valid coordinates found.");
        return;
      }

      setUploadedPoints(parsed);
      setDialogOpen(true);
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to read file.");
    }
  }

  return (
    <>
      {/* Hidden file input */}
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

      {/* Import button */}
      <button
        onClick={openPicker}
        className="px-4 py-2 cursor-pointer rounded-lg bg-emerald-500 text-white"
      >
        Click To Import Excel
      </button>

      {/* Confirmation dialog */}
      <PointConfirmDialog
      key={dialogOpen ? "open" : "closed"}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        points={uploadedPoints}
        onAdd={addPoints}
        onReplace={setPoints}
      />
    </>
  );
}
