import { getUserProfilePage } from "@/lib/services/profile"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const data = await getUserProfilePage(userId)
  return Response.json(data)
}
