import { getDistance } from "@/lib/distance";
export interface POI {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  radius?:number;
}
export function mergePOIsByRadius(pois: POI[], radius: number) {
  const groups: POI[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < pois.length; i++) {
    if (visited.has(i)) continue;

    const group: POI[] = [pois[i]];
    visited.add(i);

    for (let j = i + 1; j < pois.length; j++) {
      if (visited.has(j)) continue;

      const distance = getDistance(
        pois[i].lat,
        pois[i].lng,
        pois[j].lat,
        pois[j].lng
      ); // km
      if (distance <= radius / 1000) {
        group.push(pois[j]);
        visited.add(j);
      }
    }
    groups.push(group);
  }

  return groups;
}
export const pois: POI[] = [
  { id: 1, name: "Central Park", description: "Famous NYC park", lat: 11.970082, lng: 8.43262 },
  { id: 2, name: "Statue of Liberty", description: "Iconic landmark", lat: 11.973664, lng: 8.442184 },
  { id: 3, name: "Times Square", description: "Busy tourist area", lat: 11.96836, lng: 8.44737 },
  { id: 4, name: "Brooklyn Bridge", description: "Historic bridge", lat: 11.99805556, lng: 8.47781},
];