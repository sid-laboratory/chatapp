import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const searchParams = new URL(req.url).searchParams;
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("serverId is required", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("channelId is required", { status: 400 });
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error while editing the server", {
      status: 500,
    });
  }
}
