import mongoose from "mongoose";
import Package from "../models/Package.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

await Package.deleteMany();

await Package.insertMany([
  {
    title: "Royal Rajasthan Tour",
    city: "Jaipur",
    state: "Rajasthan",
    days: 3,
    nights: 2,
    price: 5999,
    description: "Explore forts and palaces of Jaipur",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41",

    hotels: [
      { name: "Royal Palace Hotel", type: "3 Star", pricePerNight: 1500 },
      { name: "Heritage Haveli", type: "4 Star", pricePerNight: 2500 }
    ],

    transport: [
      { type: "Train", provider: "IRCTC", price: 900 },
      { type: "Flight", provider: "Indigo", price: 3500 }
    ]
  },

  {
    title: "Goa Beach Holiday",
    city: "Goa",
    state: "Goa",
    days: 4,
    nights: 3,
    price: 8999,
    description: "Relax at beaches and nightlife",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",

    hotels: [
      { name: "Sea View Resort", type: "4 Star", pricePerNight: 3000 },
      { name: "Beach Paradise", type: "5 Star", pricePerNight: 5000 }
    ],

    transport: [
      { type: "Flight", provider: "Air India", price: 4500 },
      { type: "Bus", provider: "VRL", price: 1200 }
    ]
  },

{
  title: "Araku Valley Retreat",
  city: "Visakhapatnam",
  state: "Andhra Pradesh",
  days: 3,
  nights: 2,
  price: 6999,
  description: "Araku Valley, Borra Caves and scenic train journey",
  image: "https://images.unsplash.com/photo-1717585163355-6461aeb2f470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  hotels: [
    { name: "Valley Resort", type: "3 Star", pricePerNight: 1800 },
    { name: "Green Park Vizag", type: "4 Star", pricePerNight: 3200 }
  ],
  transport: [
    { type: "Train", provider: "IRCTC", price: 900 },
    { type: "Flight", provider: "Indigo", price: 4200 }
  ]
},

{
  title: "Tirupati Spiritual Tour",
  city: "Tirupati",
  state: "Andhra Pradesh",
  days: 2,
  nights: 1,
  price: 4999,
  description: "Visit Tirumala temple and nearby attractions",
  image: "https://www.balajitravels.org/storage/destinations/160724035049-mallikarjuna-temple-jyotirlingas-andhra-pradesh.webp",
  hotels: [
    { name: "Bhimas Deluxe", type: "3 Star", pricePerNight: 2000 },
    { name: "Marasa Sarovar", type: "4 Star", pricePerNight: 3500 }
  ],
  transport: [
    { type: "Bus", provider: "APSRTC", price: 700 },
    { type: "Train", provider: "IRCTC", price: 800 }
  ]
},

{
  title: "Vijayawada Heritage Tour",
  city: "Vijayawada",
  state: "Andhra Pradesh",
  days: 3,
  nights: 2,
  price: 5999,
  description: "Kanaka Durga Temple and Undavalli Caves",
  image: "https://www.poojn.in/wp-content/uploads/2025/02/Kanaka-Durga-Temple-A-Guide-to-Your-Visit.jpeg.jpg",
  hotels: [
    { name: "Hotel Ilapuram", type: "3 Star", pricePerNight: 1700 },
    { name: "Novotel Vijayawada", type: "5 Star", pricePerNight: 6000 }
  ],
  transport: [
    { type: "Train", provider: "IRCTC", price: 1000 },
    { type: "Flight", provider: "Air India", price: 4000 }
  ]
},

{
  title: "Lambasingi Hill Escape",
  city: "Lambasingi",
  state: "Andhra Pradesh",
  days: 2,
  nights: 1,
  price: 4499,
  description: "Chilly hill station experience and sunrise views",
  image: "https://images.herzindagi.info/her-zindagi-english/images/2024/11/19/article/image/Lambasingi-Travel-Guide-1732020039019.jpg",
  hotels: [
    { name: "Hill View Stay", type: "3 Star", pricePerNight: 1500 },
    { name: "Nature Camp Resort", type: "4 Star", pricePerNight: 2800 }
  ],
  transport: [
    { type: "Bus", provider: "APSRTC", price: 600 },
    { type: "Car", provider: "Local Travel", price: 2500 }
  ]
},

{
  title: "Srisailam Temple Tour",
  city: "Srisailam",
  state: "Andhra Pradesh",
  days: 2,
  nights: 1,
  price: 5299,
  description: "Mallikarjuna Jyotirlinga and dam visit",
  image: "https://3.bp.blogspot.com/-zrSGHEeWBwA/W8M3PU03bxI/AAAAAAABM6o/xp9KxxAD_ocisw50OPt1qp47ax2sHPHNQCEwYBhgL/s1600/2018-08-20%2B%25281%2529.jpg",
  hotels: [
    { name: "Haritha Hotel", type: "3 Star", pricePerNight: 1800 },
    { name: "Punnami Resort", type: "4 Star", pricePerNight: 3000 }
  ],
  transport: [
    { type: "Bus", provider: "APSRTC", price: 800 },
    { type: "Car", provider: "Local Travel", price: 3000 }
  ]
},
]);

console.log("Packages inserted successfully!");
process.exit();
