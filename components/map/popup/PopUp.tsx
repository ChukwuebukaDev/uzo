import { useEffect, useRef ,useState} from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import { clickToCopy } from "@/utilities/clicktocopy";

type PopupProperties = {
  time: number;
  mag: number;
  place: string;
};

type PopupFeature = GeoJSON.Feature<GeoJSON.Point, PopupProperties>;

interface PopupProps {
  map: mapboxgl.Map | null;
  activeFeature: PopupFeature | null;
}

const Popup = ({ map, activeFeature }: PopupProps) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [placeName, setPlaceName] = useState<string>("Loading...");
const [coords, setCoords] = useState<[number, number]>([0, 0]);
  //  Ensure DOM element is created only once 
  if (!contentRef.current) {
    contentRef.current = document.createElement("div");
  }

 

  //  Create popup instance
  useEffect(() => {
    if (!map) return;

    popupRef.current = new mapboxgl.Popup({
      closeOnClick: false,
      offset: 20,
    });

    return () => {
      popupRef.current?.remove();
    };
  }, [map]);

useEffect(() => {
  if (!activeFeature) return;

  const [lng, lat] = activeFeature.geometry.coordinates as [number, number];

  const fetchPlace = async () => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );

      const data = await res.json();

      const place = data.features?.[0]?.place_name;

      setPlaceName(place || "Unknown location");
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      setPlaceName("Unable to fetch location");
    }
  };

  fetchPlace();
}, [activeFeature]);
  useEffect(() => {
    if (!map || !popupRef.current) return;

    // 🔥 Remove popup if no active feature
    if (!activeFeature) {
      popupRef.current.remove();
      return;
    }
    console.log("Active feature changed:", activeFeature);

    const coords = activeFeature.geometry.coordinates as [number, number];
setCoords(coords);
    popupRef.current
      .setLngLat(coords)
      .setDOMContent(contentRef.current!) // safe because we ensure it's created
      .addTo(map);
  }, [activeFeature, map]);


  return createPortal(
  
      <div className="flex flex-col space-y-1">
        <p><span className="font-bold bg-amber-400 p-1 rounded-2xl">Name:</span> {placeName} <button className="text-green-500"  onClick={() => clickToCopy(placeName)}>Copy </button></p>
        <p><span className="font-bold bg-amber-400 p-1 rounded-2xl">Coords:</span> {coords[0].toFixed(4)}, {coords[1].toFixed(4)} <button className="text-green-500" onClick={() => clickToCopy(`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`)}>Copy </button></p>
        <p>
          <span className="font-bold bg-amber-400 p-1 rounded-2xl">Time:</span> {new Date(activeFeature?.properties.time ?? 0).toLocaleString()}
        </p>
        <p><span className="font-bold bg-amber-400 p-1 rounded-2xl">Magnitude:</span> {activeFeature?.properties.mag ?? "-"}</p>
        <p><span className="font-bold bg-amber-400 p-1 rounded-2xl">Place:</span> {activeFeature?.properties.place ?? "-"}</p>
     
    </div>,
    contentRef.current
  );
};

export default Popup;