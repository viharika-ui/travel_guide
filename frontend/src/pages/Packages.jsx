// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function Packages() {
//   const [places, setPlaces] = useState([]);
//   const [packages,setPackages] = useState([]);
//   const navigate = useNavigate();

// useEffect(() => {
//   api.get("/packages")
//     .then(res => {
//       console.log("PACKAGES:", res.data);
//       setPackages(res.data);
//     })
//     .catch(err => console.log(err));
// }, []);

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Select Destination</h2>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
//         {places.map(p => (
//           <div
//             key={p._id}
//             style={{ border:"1px solid #ddd", padding:15, cursor:"pointer" }}
//             onClick={()=>navigate(`/packages/${p._id}`)}
//           >
//             <img src={p.image} width="100%" height="150"/>
//             <h3>{p.placeName}</h3>
//             <p>{p.city}, {p.state}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Packages() {

  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/packages")
      .then(res => {
        console.log("DATA:", res.data);
        setPackages(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{paddingTop:"20px"}}>Available Tours</h2>
      <h2 >Popular packages</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>

        {packages.map(pkg => (
          <div
            key={pkg._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/packages/${pkg._id}`)}
          >
            <img
              src={pkg.image}
              alt={pkg.title}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
            />

            <h3>{pkg.title}</h3>
            <p>{pkg.city}, {pkg.state}</p>
            <p>{pkg.days} Days / {pkg.nights} Nights</p>
            <h4>₹{pkg.price}</h4>
          </div>
        ))}

      </div>
    </div>
  );
}
