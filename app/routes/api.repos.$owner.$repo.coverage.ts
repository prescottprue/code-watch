import { promisify } from "util";

import { ActionFunction, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import parseLcov from 'lcov-parse'

import { prisma } from "~/db.server";
import { requireApiKey } from "~/session.server";
import { uploadFile } from "~/storage.server";

async function saveLcovFile(filePath: string, fileObj: File) {
  // Write lcov.info to minio object storage (https://fly.io/docs/app-guides/minio)
  try {
    const fileBuffer = await fileObj.arrayBuffer();
    await uploadFile(filePath, Buffer.from(fileBuffer), fileObj.size, {
      "Content-Type": fileObj.type,
    });
  } catch (err) {
    console.log("Error uploading file", { err });
    throw err
  }
}

const parseLcovFile = promisify(parseLcov)

async function getCoverageResults(fileStr: string) {
  const files = await parseLcovFile(fileStr)
  let total = 0;
  let executed = 0;
  files?.forEach((fileResult) => {
    total += fileResult.lines.found;
    executed += fileResult.lines.hit;
  });
  const coverage = (executed / total) * 100;
  return {
    total,
    executed,
    coverage,
    files
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  console.log("Coverage upload called, checking for user", request);
  
  
  if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
    return json({ formError: "Only multipart form-data currently supported" }, 400);
  }

  // TODO: Verify that this API key has access to the repo
  await requireApiKey(request);

  // TODO: Use safe assignment opperator
  const repo = await prisma.repo.findFirst({ where: { owner: params.owner, repo: params.repo } })
  if (!repo) {
    return json(
      { errors: { file: "Repo not found" } },
      { status: 404 },
    );
  }

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );
  const file = formData.get("file");
  if (!file) {
    return json(
      { errors: { file: "Coverage file is required" } },
      { status: 400 },
    );
  }

  const branch = formData.get("branch");
  if (!branch || typeof branch !== 'string') {
    return json(
      { errors: { file: "Coverage branch is required" } },
      { status: 400 },
    );
  }

  const coverageFilePath = `coverage-results/${params.owner}/${params.repo}`;
  const fileObj = file as File;
  // Write lcov.info to minio object storage (https://fly.io/docs/app-guides/minio)

  try {
    const [results] = await Promise.all([
      getCoverageResults(file.toString()),
      saveLcovFile(coverageFilePath, fileObj)
    ])
  } catch (err) {
    console.log("Error uploading file", { err });
    return Response.json(
      { errors: { file: "Error uploading coverage file" } },
      { status: 400 },
    );
  }

  // TODO: Load user id from api key
  // const userId = await requireUserId(request);
  // console.log("User id loaded for upload request:", userId);
  try {
    const snapshot = await prisma.coverageSnapshot.create({
      data: { coverageFilePath, repoId: repo.id, branch, },
    });
    console.log("Snapshot uploaded successfully");
    return Response.json(snapshot, { status: 200 });
  } catch (e) {
    // return error action data
    return { error: e };
  }
};
