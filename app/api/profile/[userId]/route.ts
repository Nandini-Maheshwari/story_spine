import { getUserProfilePage } from "@/lib/services/profile"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const data = await getUserProfilePage(params.userId)
  return Response.json(data)
}
