export type Coordinates = {
  lat: number;
  lng: number;
  name?:string;
};

export type RouteInfo = {
  distance: number;
  duration: number;
  geometry: Coordinates[];
};