const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz',
  secure: true
});

const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
         process.env.CLOUDINARY_API_KEY &&
         process.env.CLOUDINARY_API_KEY !== '1234567890';
};

const uploadBufferToCloudinary = (fileBuffer, folder = 'portfolio_products') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      // Fallback placeholder when Cloudinary keys aren't live
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const mockUrl = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80`;
      return resolve({
        public_id: mockId,
        secure_url: mockUrl,
        url: mockUrl,
        format: 'jpg',
        width: 1200,
        height: 800
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1600, crop: 'limit' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteCloudinaryAsset = async (publicId) => {
  if (!publicId || publicId.startsWith('mock_')) return { result: 'ok' };
  try {
    if (isCloudinaryConfigured()) {
      return await cloudinary.uploader.destroy(publicId);
    }
    return { result: 'ok' };
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return { result: 'error', error };
  }
};

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
  deleteCloudinaryAsset,
  isCloudinaryConfigured
};
