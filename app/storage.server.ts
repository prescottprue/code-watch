import type { Readable } from "stream";

import * as Minio from "minio";
import invariant from "tiny-invariant";

import { singleton } from "./singleton.server";

const minio = singleton("minio", getStorageClient);

function getStorageClient() {
  const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY } = process.env;
  invariant(
    typeof MINIO_ACCESS_KEY === "string",
    "MINIO_ACCESS_KEY env var not set",
  );
  invariant(
    typeof MINIO_SECRET_KEY === "string",
    "MINIO_SECRET_KEY env var not set",
  );
  const minioClient = new Minio.Client({
    endPoint: "localhost", // TODO: support FLY.io hosted minio
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  });
  return minioClient;
}

const bucket = "vehicle-work-log";

export async function uploadFile(
  objectName: string,
  stream: string | Readable | Buffer,
  size?: number,
  metaData?: Minio.ItemBucketMetadata | undefined,
) {
  await minio.putObject(bucket, objectName, stream, size, metaData);
}

export async function getFileUrl(objectName: string) {
  const objectUrl = await minio.presignedGetObject(bucket, objectName);
  return objectUrl;
}


export async function getFileWithSignedUrl(objectName: string) {
  const stats = await minio.statObject(bucket, objectName)
  const objectUrl = await minio.presignedGetObject(bucket, objectName);
  return {
    ...stats,
    url: objectUrl
  };
}
