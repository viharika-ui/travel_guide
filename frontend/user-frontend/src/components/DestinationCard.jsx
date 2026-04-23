import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DestinationCard({ destination }) {
  const { t } = useTranslation();
  const image = destination.images?.[0] || "/placeholder-dest.jpg";
  const imageUrl = image.startsWith("http") ? image : (import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000") + image;

  return (
    <Link
      to={`/destination/${destination._id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
    >
      <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1524499940831-2a253ecb92eb?w=400";
          }}
        />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          {destination.rating > 0 && (
            <span className="bg-black/60 text-amber-400 px-2 py-0.5 rounded text-sm">
              ★ {destination.rating}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-navy truncate">{destination.name}</h3>
        {destination.stateId?.name && (
          <p className="text-slate-500 text-sm">{destination.stateId.name}</p>
        )}
        <span className="inline-block mt-2 text-saffron font-medium">
          {t("explore.viewDetails")} →
        </span>
      </div>
    </Link>
  );
}
