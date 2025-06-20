const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce-products',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`
    },
});

const upload = multer({ storage });
module.exports = upload;
