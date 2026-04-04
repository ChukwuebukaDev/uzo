import DialogOverlay from "../ui/DialogOverlay";
import ExcelImporter from "@/features/import/ExcelImporter";
import RenderBoard from "../ui/dashboard/RenderBoards.";
import CoordinateInput from "../../features/textarea/CordinateArea";
import PointList from '../points/PointList'
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
    <DialogOverlay open={activePanel === "dashboard"} onClose={closePanel}>
        <RenderBoard />
      </DialogOverlay>
    <DialogOverlay open={activePanel === "pointlist"} onClose={closePanel}>
        <PointList open = {activePanel === "pointlist"} onClose={closePanel}/>
      </DialogOverlay>
    </>
  );
}