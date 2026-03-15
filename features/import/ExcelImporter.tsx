"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useMapStore } from "@/stores/useMapStore";
import PointConfirmDialog from "@/components/ui/PointConfirmDialog";

export default function ExcelImporter() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { addPoints, setPoints } = useMapStore();
  const [uploadedPoints, setUploadedPoints] = useState<
    { lat: number; lng: number,name?:string }[]
  >([]);

  function openPicker() {
    fileRef.current?.click();
  }

  const handleFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const parsed = jsonData
      .map((row: any) => {
        const lat = Number(row.lat ?? row.Lat ?? row.latitude);
        const lng = Number(row.lng ?? row.Lng ?? row.longitude);
        const name = (row.his);
        if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng , name};
        return null;
      })
      .filter(Boolean) as { lat: number; lng: number,name:string}[];

    if (parsed.length > 0) {
      setUploadedPoints(parsed);
      setDialogOpen(true); // open modal
    }
  };

  return (
    <>
      {/* Hidden input */}
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        onClick={openPicker}
        className="px-4 py-2 cursor-pointer rounded-lg bg-emerald-500 text-white"
      >
        Click To Import Excel
      </button>

      <PointConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        points={uploadedPoints}
        onAdd={addPoints}
        onReplace={setPoints}
      />
    </>
  );
}
