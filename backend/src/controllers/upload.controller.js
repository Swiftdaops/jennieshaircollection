import cloudinary from "../config/cloudinary.js";

export const uploadImages = async (req, res) => {
  const uploads = await Promise.all(
    req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: "products" })
    )
  );

  res.json(uploads.map(u => u.secure_url));
};
