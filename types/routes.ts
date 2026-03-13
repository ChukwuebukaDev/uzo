export type Coordinates = {
  lat: number;
  lng: number;
};

export type RouteInfo = {
  distance: number;
  duration: number;
  geometry: Coordinates[];
};