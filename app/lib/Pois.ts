export interface POI {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export const pois: POI[] = [
  { id: 1, name: "Central Park", description: "Famous NYC park", lat: 40.7851, lng: -73.9683 },
  { id: 2, name: "Statue of Liberty", description: "Iconic landmark", lat: 40.6892, lng: -74.0445 },
  { id: 3, name: "Times Square", description: "Busy tourist area", lat: 40.758, lng: -73.9855 },
  { id: 4, name: "Brooklyn Bridge", description: "Historic bridge", lat: 40.7061, lng: -73.9969 },
];