import cloudinary from "../config/cloudinary.js";
import streamifier from 'streamifier'

export const uploadToCloudinary = (buffer, folder = 'general') => {
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            (folder),
            (error, stream) => {
                if(stream) resolve(stream);
                else reject(error)
            }
        )
        streamifier.createReadStream(buffer.pipe(stream));
    })
}