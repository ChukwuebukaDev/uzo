"use client";

import { useMapStore } from "@/stores/useMapStore";
import { useEffect, useState } from "react";
import WeatherCard from "@/components/weather/WeatherCard";

const OpenWeatherMapKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY;

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userLocation = useMapStore((s) => s.userLocation);
  const { lat, lng } = userLocation || { lat: 6.5244, lng: 3.3792 };

  useEffect(() => {
    if (!OpenWeatherMapKey) {
      console.error("Missing OpenWeather API key");
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OpenWeatherMapKey}`
        );

        if (!res.ok) throw new Error("Failed to fetch weather");

        const data = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  return (
    <main className="min-h-screen p-2 bg-linear-to-b from-emerald-50 to-white">
      {loading && <p>Loading weather...</p>}

      {!loading && weatherData && (
        <WeatherCard weatherData={weatherData} />
      )}
    </main>
  );
}