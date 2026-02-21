import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./PackageDetails.css";

export default function Booking(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg,setPkg] = useState(null);
  const [hotel,setHotel] = useState(null);
  const [transport,setTransport] = useState(null);
  const [date,setDate] = useState("");
  const [needGuide,setNeedGuide] = useState(false);

  useEffect(()=>{
    api.get(`/packages/${id}`).then(res=>setPkg(res.data));
  },[id]);

  if(!pkg) return <h2>Loading...</h2>;

  const total =
    pkg.price +
    (hotel?.pricePerNight || 0) * pkg.nights +
    (transport?.price || 0) +
    (needGuide ? 800 : 0);

  // const handlePayment = async () => {
  //   const { data: order } = await api.post("/payment/create-order",{ amount: total });

  //   const options = {
  //     key: import.meta.env.VITE_RAZORPAY_KEY,
  //     amount: order.amount,
  //     currency: "INR",
  //     name: "Incredible India",
  //     description: pkg.title,
  //     order_id: order.id,

  //     handler: async function (response) {

  //       await api.post("/payment/verify",response);

  //       await api.post("/bookings",{
  //         packageId: pkg._id,
  //         hotel,
  //         transport,
  //         date,
  //         needGuide,
  //         totalPrice: total
  //       });

  //       alert("Booking Successful 🎉");
  //       navigate("/");
  //     }
  //   };

  //   new window.Razorpay(options).open();
  // };
// const handlePayment = async () => {

//   console.log("PAY BUTTON CLICKED");

//   try {

//     console.log("Creating order...");

//     const { data: order } = await api.post("/payment/create-order", {
//       amount: total
//     });

//     console.log("ORDER RECEIVED:", order);

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: order.amount,
//       currency: "INR",
//       name: "Incredible India",
//       description: pkg.title,
//       order_id: order.id,

//       handler: async function (response) {
//         console.log("PAYMENT SUCCESS", response);
//       }
//     };

//     console.log("Opening Razorpay...");
//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
//     console.log("PAYMENT ERROR:", err.response?.data || err.message);
//     alert("Order creation failed");
//   }
// };
// const handlePayment = async () => {
//   try {

//     // 1 get razorpay key
//     const { data } = await api.get("/bookings/key");

//     // 2 create order
//     const { data: order } = await api.post("/payment/create-order", {
//       amount: total
//     });

//     // 3 open payment popup
//     const options = {
//       key: data.key,
//       amount: order.amount,
//       currency: "INR",
//       name: "Incredible India",
//       description: pkg.title,
//       order_id: order.id,

//       handler: async function (response) {

//         await api.post("/payment/verify", response);

//         await api.post("/bookings", {
//           packageId: pkg._id,
//           hotel,
//           transport,
//           date,
//           needGuide,
//           totalPrice: total
//         });

//         alert("Booking Successful 🎉");
//         navigate("/");
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
//     console.log(err);
//     alert("Payment Failed");
//   }
// };
  const handlePayment = async () => {
  try {

    // 1️⃣ get razorpay public key
    const { data: keyData } = await api.get("/bookings/key");

    // 2️⃣ create order
    const { data: order } = await api.post("/bookings/create-order", {
      amount: total
    });

    // 3️⃣ open razorpay
    const options = {
      key: keyData.key,
      amount: order.amount,
      currency: "INR",
      name: "Incredible India",
      description: pkg.title,
      order_id: order.id,

      handler: async function (response) {

        // send payment verification
        await api.post("/bookings/verify", {
          paymentId: response.razorpay_payment_id,
          bookingData: {
            packageId: pkg._id,
            hotel,
            transport,
            date,
            needGuide,
            totalPrice: total
          }
        });

        alert("Booking Successful 🎉");
        navigate("/");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    alert("Payment Failed");
  }
};

  return (
    <div className="package-page">

      <div className="package-container">

        <h2>{pkg.title}</h2>

        <h3 className="section-title">Select Hotel</h3>
        {pkg.hotels.map(h=>(
          <label key={h.name} className="option-card">
            <input type="radio" name="hotel" onChange={()=>setHotel(h)} />
            <span>{h.name} ({h.type})</span>
            <span className="option-price">₹{h.pricePerNight}/night</span>
          </label>
        ))}

        <h3 className="section-title">Select Transport</h3>
        {pkg.transport.map(t=>(
          <label key={t.provider} className="option-card">
            <input type="radio" name="transport" onChange={()=>setTransport(t)} />
            <span>{t.type} - {t.provider}</span>
            <span className="option-price">₹{t.price}</span>
          </label>
        ))}

        <h3 className="section-title">Travel Date</h3>
        <input className="date-input" type="date" onChange={(e)=>setDate(e.target.value)} />

        <div className="guide-box">
          <input type="checkbox" onChange={(e)=>setNeedGuide(e.target.checked)} />
          Need Travel Guide (+₹800)
        </div>

        <div className="payment-bar">
          <div className="total-price">₹{total}</div>
          <button
            className="pay-btn"
            disabled={!hotel || !transport || !date}
            onClick={handlePayment}
          >
            Pay & Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
