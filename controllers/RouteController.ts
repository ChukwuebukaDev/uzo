// import { getRoute as fetchRoute } from "@/lib/routing/getRoute";
// import { useRouteStore } from "@/stores/useRouteStore";
// import { toast } from "sonner";

// export async function calculateRoute() {
//   const { origin, destination, setRoute } =
//     useRouteStore.getState();

//   if (!origin || !destination) {
//     toast.error("Select both origin and destination first.");
//     return;
//   }

//   await toast.promise(
//     fetchRoute(origin, destination),
//     {
//       loading: "Calculating best route...",
//       success: (route) => {
//         setRoute(route);
//         return "Route calculated successfully 🚗";
//       },
//       error: (err) => {
//         const message =
//           err instanceof Error
//             ? err.message
//             : "Failed to calculate route";

//         return message;
//       },
//     }
//   );
// }
