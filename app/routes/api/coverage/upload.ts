import { ActionFunction, LoaderFunction, unstable_parseMultipartFormData } from "remix";
import { json } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

interface CoverageUploadRequestBody {
  result: any
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  console.log('Outdated upload called, checking for user', request)

  // Parse and verify request body
  const requestBody: CoverageUploadRequestBody = await request.json()
  console.log('Result', requestBody)
  if (!requestBody) {
    return json({ formError: 'result is required' }, 400)
  }

  const userId = await requireUserId(request);
  console.log('User id loaded for upload request:', userId)
  try {
    // TODO: Lookup user based on api key
    // return success action data
    const snapshot = await db.coverageSnapshot.create({
      data: { result: requestBody.result, userId }
    });
    console.log('Snapshot uploaded successfully')
    return json(snapshot, 200);
  } catch (e) {
    // return error action data
    return { error: e };
  }
};