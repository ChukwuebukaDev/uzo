export function formatDistance(meters: number) {
  return meters >= 1000
    ? (meters / 1000).toFixed(1) + " km"
    : meters.toFixed(0) + " m";
}

export function formatDuration(seconds: number) {
  const mins = Math.round(seconds / 60);

  if (mins < 60) return `${mins} min`;

  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;

  return `${hrs} h ${rem} min`;
}