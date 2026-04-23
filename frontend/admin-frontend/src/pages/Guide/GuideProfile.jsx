import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGuide } from "../../context/GuideContext";
import { C, Btn, Input, Textarea, Spinner } from "../../components";

const GuideProfile = () => {
  const { gToken, backendUrl, guideData, setGuideData, getGuideProfile } =
    useGuide();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", guideData.name || "");
      formData.append("speciality", guideData.speciality || "");
      formData.append("experience", guideData.experience || "");
      formData.append("degree", guideData.degree || "");
      formData.append("about", guideData.about || "");
      formData.append("fee", guideData.fee || 0);
      formData.append("available", Boolean(guideData.available).toString());
      formData.append("languages", JSON.stringify(guideData.languages || []));
      formData.append("address", JSON.stringify(guideData.address || {}));
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
    if (gToken) {
      getGuideProfile();
    }
  }, [gToken, getGuideProfile]);

  if (!guideData) return <Spinner />;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: 0 }}>Guide Profile</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>Manage your public information, booking rates, and availability.</p>
        </div>
        <div>
          {isEdit ? (
            <div style={{ display: "flex", gap: 10 }}>
              <Btn
                variant="ghost"
                onClick={() => {
                  setIsEdit(false);
                  setImage(null);
                  getGuideProfile();
                }}
              >
                Cancel
              </Btn>
              <Btn onClick={updateProfile}>Save Changes</Btn>
            </div>
          ) : (
            <Btn onClick={() => setIsEdit(true)}>Edit Profile</Btn>
          )}
        </div>
      </div>

      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: 32, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <h2 style={{ fontSize: 18, color: C.text, fontWeight: 600, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>Personal Information</h2>
        
        {/* Photo Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <img
            src={image ? URL.createObjectURL(image) : guideData.image?.startsWith("http") ? guideData.image : `${backendUrl}${guideData.image || ''}`}
            alt=" profile"
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.border}` }}
          />
          {isEdit && (
            <div>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={(e) => setImage(e.target.files[0])}
              />
              <Btn variant="ghost" size="sm" onClick={() => fileInputRef.current.click()}>Upload New Photo</Btn>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Input 
            label="Full Name" 
            value={guideData.name || ""} 
            disabled={!isEdit} 
            onChange={(e) => setGuideData((prev) => ({ ...prev, name: e.target.value }))} 
          />
          <Input 
            label="Email Address" 
            value={guideData.email || ""} 
            disabled 
          />
          <Input 
            label="Speciality" 
            value={guideData.speciality || ""} 
            disabled={!isEdit} 
            onChange={(e) => setGuideData((prev) => ({ ...prev, speciality: e.target.value }))} 
          />
          <Input 
            label="Experience" 
            value={guideData.experience || ""} 
            disabled={!isEdit} 
            onChange={(e) => setGuideData((prev) => ({ ...prev, experience: e.target.value }))} 
          />
          <Input 
            label="Degree" 
            value={guideData.degree || ""} 
            disabled={!isEdit} 
            onChange={(e) => setGuideData((prev) => ({ ...prev, degree: e.target.value }))} 
          />
          <Input 
            label="Languages" 
            placeholder="English, Spanish, Hindi..."
            value={Array.isArray(guideData.languages) ? guideData.languages.join(", ") : (guideData.languages || "")} 
            disabled={!isEdit} 
            onChange={(e) => setGuideData((prev) => ({ ...prev, languages: e.target.value.split(",").map(lang => lang.trim()).filter(lang => lang.length > 0) }))} 
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <Textarea
            label="About Me (Bio)"
            value={guideData.about || ""}
            disabled={!isEdit}
            onChange={(e) => setGuideData((prev) => ({ ...prev, about: e.target.value }))}
            placeholder="Write a few sentences about your guiding experience..."
          />
        </div>
      </div>

      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <h2 style={{ fontSize: 18, color: C.text, fontWeight: 600, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>Business Details</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <Input
            type="number"
            label="Daily Fee (₹)"
            disabled={!isEdit}
            value={guideData.fee || ""}
            onChange={(e) => setGuideData((prev) => ({ ...prev, fee: e.target.value }))}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 8, letterSpacing: .5 }}>BASE LOCATION</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Input
              disabled={!isEdit}
              placeholder="Address Line 1"
              value={guideData.address?.line1 || ""}
              onChange={(e) => setGuideData((prev) => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))}
            />
            <Input
              disabled={!isEdit}
              placeholder="Address Line 2"
              value={guideData.address?.line2 || ""}
              onChange={(e) => setGuideData((prev) => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Available for Bookings</span>
            <span style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              Toggle this to let tourists know if you are open for new requests.
            </span>
          </div>
          <button
            type="button"
            disabled={!isEdit}
            onClick={() => {
              if (isEdit) {
                setGuideData((prev) => ({ ...prev, available: !prev.available }));
              }
            }}
            style={{
              width: 50, height: 26, borderRadius: 30, border: "none", cursor: isEdit ? "pointer" : "not-allowed",
              background: guideData.available ? C.success : "#cbd5e1",
              position: "relative", transition: "background 0.3s", opacity: isEdit ? 1 : 0.6
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
              left: guideData.available ? 26 : 4, transition: "left 0.3s"
            }} />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default GuideProfile;
