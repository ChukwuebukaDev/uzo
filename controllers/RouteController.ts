import { getRoute as fetchRoute } from "@/lib/routing/getRoute";
import { useRouteStore } from "@/stores/useRouteStore";
import { toast } from "sonner";

export async function calculateRoute() {
  const { origin, destination, setRoute } =
    useRouteStore.getState();
 if (!origin || !destination) {
    toast.error("Waiting for both origin and destination before fetching route.");
    return; // do nothing until both are set
  }

  try {
    const route = await fetchRoute(origin, destination);
    setRoute(route);
  } catch (err) {
    toast.error("Failed to calculate route:", err);
  }
}