const cloudinary = require("cloudinary").v2
cloudinary.config({ 
    cloud_name: "dvlylpvgj", 
    api_key: "267121216412929",
    api_secret: "KrtPZkUiBhJwp6aKH92SfiV7lVo",
    secure: true,
    cdn_subdomain: true,
  });
  
const uploadImage = async (filebuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto"
            },
            (error, result) => {
                if (error)
                    reject(error)
                else
                    resolve(result.secure_url)
            }
        ).end(filebuffer)
    })
}

module.exports = { uploadImage }