import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

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

  //  Ensure DOM element is created only once (important)
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
    if (!map || !popupRef.current) return;

    // 🔥 Remove popup if no active feature
    if (!activeFeature) {
      popupRef.current.remove();
      return;
    }

    const coords = activeFeature.geometry.coordinates as [number, number];

    popupRef.current
      .setLngLat(coords)
      .setDOMContent(contentRef.current!) // safe because we ensure it's created
      .addTo(map);
  }, [activeFeature, map]);


  return createPortal(
    <div className="portal-content">
      <table>
        <tbody>
          <tr>
            <td><strong>Time</strong></td>
            <td>
              {new Date(activeFeature?.properties.time ?? 0).toLocaleString()}
            </td>
          </tr>
          <tr>
            <td><strong>Magnitude</strong></td>
            <td>{activeFeature?.properties.mag ?? "-"}</td>
          </tr>
          <tr>
            <td><strong>Place</strong></td>
            <td>{activeFeature?.properties.place ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>,
    contentRef.current
  );
};

export default Popup;