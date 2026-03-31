export async function getDistanceMapbox(
  from: [number, number],
  to: [number, number],
) {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${from[1]},${from[0]};${to[1]},${to[0]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
  );
  const data = await response.json();
  if (!data.routes || !data.routes.length) return null;

  const route = data.routes[0];
  return route.distance / 1000; // meters → km
}
