const { uploadBufferToCloudinary, deleteCloudinaryAsset } = require('../config/cloudinary');

const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    const uploadPromises = req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, 'portfolio_products')
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url || result.url,
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully to Cloudinary',
      images: uploadedImages,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'public_id is required to delete asset',
      });
    }

    const result = await deleteCloudinaryAsset(public_id);

    res.status(200).json({
      success: true,
      message: 'Image asset deleted from Cloudinary',
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages, deleteImage };
