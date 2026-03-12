export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p>© {new Date().getFullYear()} GeoApp</p>
        <p className="text-sm text-gray-400">
          Built with Next.js and geospatial technology
        </p>
      </div>
    </footer>
  );
}