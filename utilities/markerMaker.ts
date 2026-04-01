import mapboxgl from "mapbox-gl";
export function addMarker(
  map: mapboxgl.Map,
  lngLat: [number, number],
  color: string,
) {
  const el = document.createElement("div");
  el.style.width = "16px";
  el.style.height = "16px";
  el.style.borderRadius = "50%";
  el.style.background = color;
  el.style.boxShadow = "0 0 0 3px white, 0 4px 12px rgba(0,0,0,0.25)";
  return new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
}
