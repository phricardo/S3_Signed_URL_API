import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

function validateEnv() {
  if (!API_KEY) {
    console.error("Error: The environment variable API_KEY is not defined.");
    process.exit(1);
  }
}

validateEnv();

const app = express();
app.use(cors());
app.use(express.json());

function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }

  next();
}

app.post("/presigned-url", checkApiKey, async (req, res) => {
  try {
    const {
      region,
      endpoint,
      accessKeyId,
      secretAccessKey,
      bucket,
      objectKey,
      contentType,
      forcePathStyle = true,
    } = req.body;

    if (
      !region ||
      !endpoint ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucket ||
      !objectKey ||
      !contentType
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
    });

    // PUT (upload) command
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType,
    });

    const putUrl = await getSignedUrl(s3, putCommand, { expiresIn: 300 });

    // GET (download) command
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });

    const getUrl = await getSignedUrl(s3, getCommand, { expiresIn: 300 });

    return res.json({
      uploadUrl: putUrl,
      downloadUrl: getUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running`));
