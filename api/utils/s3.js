const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function deleteS3Image(imageUrl) {
  if (!imageUrl) return;
  const urlParts = imageUrl.split('/');
  const key = urlParts.slice(3).join('/');
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Failed to delete image from S3:', err);
    }
  });
}

module.exports = { deleteS3Image };
