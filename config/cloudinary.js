
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config(); // Add this line in cloudinary.js

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Cloudinary configured:", !!process.env.CLOUDINARY_API_KEY);

export default cloudinary;








// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// console.log('Cloudinary Config Check:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING'
// });
// console.log("Cloudinary configured:", !!process.env.CLOUDINARY_API_KEY);

// export default cloudinary;
