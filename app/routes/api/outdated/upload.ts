import { OutdatedDependency } from "@prisma/client";
import { ActionFunction } from "remix";
import { json } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/services/session.server";

interface OutdatedUploadRequestBody {
  outdatedDependencies: OutdatedDependency[]
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  console.log('Outdated upload called, checking for user')
  const userId = await requireUserId(request);
  console.log('User id loaded for upload request:', userId)

  // Parse and verify request body
  const requestBody: OutdatedUploadRequestBody = await request.json()
  console.log('Result', requestBody)
  if (!requestBody) {
    return json({ formError: 'result is required' }, 400)
  }

  try {
    // return success action data
    const snapshot = await db.outdatedSnapshot.create({
      data: {
        outdatedDependencies: {
          create: requestBody.outdatedDependencies
        },
        userId
      }
    });
    console.log('Snapshot uploaded successfully')
    return json(snapshot, 200);
  } catch (e) {
    // return error action data
    return { error: e };
  }
};