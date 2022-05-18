import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (fileName) => {
  return await cloudinary.uploader.upload(fileName);
};

export const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
