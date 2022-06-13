import { ActionFunction } from "remix";
import { json } from "remix";
import { db } from "~/utils/db.server";
import { requireAuthHeader, requireUserId } from "~/services/session.server";
import { Prisma } from '@prisma/client'
import { to } from "~/utils/async";

interface CoverageUploadRequestBody {
  result: any
  repoId: string
}

console.log('typeof response', typeof Response)

async function validateRequest(request: Request): Promise<globalThis.Response | CoverageUploadRequestBody> {
  if (request.method !== "POST") {
    console.log('Invalid request method - only POST is currently supported')
    return json({ message: "Method not allowed" }, 405);
  }
  console.log('Coverage upload called, checking for user')

  // Parse and verify request body
  console.log('Parsing request body')
  const requestBody: CoverageUploadRequestBody = await request.json()
  console.log('Upload request body', requestBody)
  if (!requestBody) {
    return json({ formError: 'Coverage results are required' }, 400)
  }
  return requestBody
}

export const action: ActionFunction = async ({ request }) => {
  const validRequestBodyOrResponse = await validateRequest(request)
  // Handle response already returned (i.e. errors)
  if (validRequestBodyOrResponse instanceof Response) {
    return validRequestBodyOrResponse
  }
  const requestBody = validRequestBodyOrResponse as CoverageUploadRequestBody
  const { repoId, result } = requestBody

  // Get user info from auth header
  const [getUserError, userId] = await to(requireAuthHeader(request));
  if (getUserError) {
    return json({ error: 'Error getting user' }, 401);
  }
  if (!userId) {
    return json({ error: 'Unauthorized. Please confirm token is valid.' }, 401);
  }
  console.log('User loaded for upload coverag request', userId)

  // Lookup repo
  // TODO: Confirm current user has access to repo
  const [getRepoError, repoSnapshot] = await to(
    db.repo.findFirst({
      where: { id: `${repoId}` },
    })
  )
  if (getRepoError) {
    console.error('Error getting repo', getRepoError)
    return json({ error: 'Error with Repo lookup' }, 500)
  }
  if (!repoSnapshot) {
    console.log('Repo not found', { repoId })
    return json({ error: 'Repo not found' }, 404)
  }

  // Create coverage snapshot
  try {
    const snapshot = await db.coverageSnapshot.create({
      data: { result: requestBody.result, userId: `${userId}`, repoId: `${repoId}` }
    });
    console.log('Snapshot uploaded successfully')
    return json(snapshot, 200);
  } catch (e) {
    // return error action data
    console.error('Error uploading snapshot', e)
    const error = e as any
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('------------------------------------------------------\n\n')
    // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email'
        )
      }
    }
    return json({ error: e }, 500);
  }
};