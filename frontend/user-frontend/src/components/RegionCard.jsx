import { Link } from "react-router-dom";

export default function RegionCard({ region }) {
  return (
    <Link
      to={`/explore?regionId=${region._id}`}
      className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
    >
      {region.icon ? (
        <span className="text-4xl mb-2">{region.icon}</span>
      ) : (
        <div className="w-14 h-14 rounded-full bg-saffron/20 flex items-center justify-center text-2xl mb-2">
          🗺️
        </div>
      )}
      <span className="font-medium text-navy">{region.name}</span>
    </Link>
  );
}
