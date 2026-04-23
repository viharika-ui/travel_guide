import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const GuideContext = createContext();

const GuideContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [gToken, setGToken] = useState(
    localStorage.getItem("gToken") || ""
  );
  const [guideData, setGuideData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  const getGuideProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/guide/profile`, {
        headers: { gToken },
      });
      if (data.success) {
        setGuideData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getGuideAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/guide/appointments`, {
        headers: { gToken },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/guide/cancel-booking`,
        { bookingId },
        { headers: { gToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getGuideAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/guide/complete-booking`,
        { bookingId },
        { headers: { gToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getGuideAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/guide/dashboard`, {
        headers: { gToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    gToken,
    setGToken,
    backendUrl,
    guideData,
    setGuideData,
    appointments,
    setAppointments,
    getGuideAppointments,
    cancelBooking,
    completeBooking,
    getDashData,
    dashData,
    getGuideProfile,
  };

  return (
    <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
  );
};

export default GuideContextProvider;
export const useGuide = () => useContext(GuideContext);
