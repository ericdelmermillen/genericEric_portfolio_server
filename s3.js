import { v4 as uuid } from "uuid";
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;


if(!AWS_REGION || !AWS_BUCKET_NAME || !AWS_ACCESS_KEY || !AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing required AWS environment variables.");
};


// Initialize S3 client with SDK v3
const s3Client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION
});

// Generate upload URL function using SDK v3
const generateUploadURL = async (dirname) => {
  const awsDirname = dirname;

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: `${awsDirname}/${uuid()}.jpeg`
  });

  const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return uploadURL;
};

// Delete multiple files function using SDK v3
const deleteFiles = async (fileNames) => {
  try {
    const deletePromises = fileNames.map(async (fileName) => {
      const deleteParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
      };
      const response = await s3Client.send(new DeleteObjectCommand(deleteParams));
      return response;
    });

    const responses = await Promise.all(deletePromises);
    return responses;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  };
};

export {
  generateUploadURL,
  deleteFiles
};