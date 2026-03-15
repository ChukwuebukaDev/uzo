import DialogOverlay from "../ui/DialogOverlay";
import ExcelImporter from "@/features/import/ExcelImporter";
import CoordinateInput from "../../features/textarea/CordinateArea";
import { useMapStore } from "@/stores/useMapStore";

export default function ToolRenderer() {
  const { activePanel, closePanel } = useMapStore();

  return (
    <>
      <DialogOverlay open={activePanel === "excel"} onClose={closePanel}>
        <ExcelImporter />
      </DialogOverlay>
      <DialogOverlay open={activePanel === "input"} onClose={closePanel}>
        <CoordinateInput />
      </DialogOverlay>

      {/* Save Panel */}
      {/* <DialogOverlay open={activePanel === "save"} onClose={closePanel}>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-gray-800">Save Points</h3>
          <button
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            onClick={() => alert("Save logic goes here")}
          >
            Save Data
          </button>
        </div>
      </DialogOverlay> */}
    </>
  );
}