import Image from "next/image";

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
};

export default function WeatherCard({ weatherData }: { weatherData: WeatherData }) {
  if (!weatherData) return null;

  const condition = weatherData.weather[0]?.main;

  const getIcon = () => {
    switch (condition) {
      case "Clear":
        return "/weather-images/sun.png";
      case "Clouds":
        return "/weather-images/cloud.png";
      case "Rain":
      case "Thunderstorm":
        return "/weather-images/storm.png";
      case "Snow":
        return "/weather-images/snow.png";
      default:
        return "/weather-images/temporary-main-weather.png";
    }
  };

  return (
    <div className="bg-white w-60 h-52 hover:animate-bounce cursor-pointer rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">
          {weatherData.name}
        </h1>

        <Image
          src={getIcon()}
          alt="Weather Icon"
          width={60}
          height={60}
        />
      </div>

      <div className="text-center">
        <p className="text-4xl font-bold">
          {Math.round(weatherData.main.temp)}°C
        </p>
        <p className="text-gray-500 capitalize">
          {weatherData.weather[0].description}
        </p>
      </div>

      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Condition: {condition}</p>
      </div>
    </div>
  );
}