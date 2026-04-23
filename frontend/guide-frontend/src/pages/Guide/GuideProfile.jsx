import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGuide } from "../../context/GuideContext";

const GuideProfile = () => {
  const { gToken, backendUrl, guideData, setGuideData, getGuideProfile } =
    useGuide();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("about", guideData.about);
      formData.append("fee", guideData.fee);
      formData.append("available", guideData.available);
      formData.append(
        "address",
        JSON.stringify(guideData.address)
      );
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/guide/update-profile`,
        formData,
        { headers: { gToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setImage(null);
        getGuideProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (gToken) getGuideProfile();
  }, [gToken]);

  return (
    guideData && (
      <div className="flex flex-col gap-6 m-5 max-w-3xl">
        {/* Profile Image */}
        <div>
          {isEdit ? (
            <label htmlFor="guide-img" className="cursor-pointer block w-36">
              <img
                src={image ? URL.createObjectURL(image) : guideData.image}
                alt="profile"
                className="w-36 h-36 object-cover rounded-2xl bg-blue-50"
              />
              <input
                id="guide-img"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              <p className="text-xs text-center text-blue-500 mt-1">
                Click to change
              </p>
            </label>
          ) : (
            <img
              src={guideData.image}
              alt="profile"
              className="w-36 h-36 object-cover rounded-2xl bg-blue-50"
            />
          )}
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
          {/* Name & Speciality */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {guideData.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-slate-500">{guideData.speciality}</p>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                {guideData.experience}
              </span>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">About:</p>
            {isEdit ? (
              <textarea
                rows={4}
                value={guideData.about}
                onChange={(e) =>
                  setGuideData((prev) => ({ ...prev, about: e.target.value }))
                }
                className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-400 resize-none"
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                {guideData.about}
              </p>
            )}
          </div>

          {/* Fee */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-700">
              Tour Fee per day:
            </p>
            {isEdit ? (
              <input
                type="number"
                value={guideData.fee}
                onChange={(e) =>
                  setGuideData((prev) => ({ ...prev, fee: e.target.value }))
                }
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-blue-400"
              />
            ) : (
              <p className="text-sm text-slate-700">₹ {guideData.fee}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Base Location:
            </p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={guideData.address?.line1 || ""}
                  placeholder="Address line 1"
                  onChange={(e) =>
                    setGuideData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  value={guideData.address?.line2 || ""}
                  placeholder="Address line 2"
                  onChange={(e) =>
                    setGuideData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                {guideData.address?.line1}
                {guideData.address?.line2 && (
                  <>
                    <br />
                    {guideData.address.line2}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Available toggle */}
          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={guideData.available}
              onChange={() => {
                if (isEdit)
                  setGuideData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }));
              }}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <label
              htmlFor="available"
              className="text-sm text-slate-700 cursor-pointer select-none"
            >
              Available for bookings
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {isEdit ? (
              <>
                <button
                  onClick={updateProfile}
                  className="bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setImage(null);
                    getGuideProfile();
                  }}
                  className="border border-slate-200 text-slate-600 text-sm font-medium px-6 py-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="border border-blue-200 text-blue-500 text-sm font-medium px-6 py-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default GuideProfile;
