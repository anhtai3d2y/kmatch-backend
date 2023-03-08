import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName || 'anhtai3d2y',
  api_key: apiKey || '359976413588993',
  api_secret: apiSecret || 'Mwzj54t_WYfKtVWfutJuaD5yYW8',
});

export const uploadFile = async (fileName) => {
  return await cloudinary.uploader.upload(fileName);
};

export const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
