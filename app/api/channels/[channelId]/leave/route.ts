import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
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
    const searchParams = new URL(req.url).searchParams;
    const serverId = searchParams.get("serverId");
    console.log("serverId", serverId, "profile", profile);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.channelId) {
      return new NextResponse("channelId is required", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("serverId is required", { status: 401 });
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
          delete: {
            id: params.channelId,
            name: {
              notIn: ["General", "general"],
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error while deleting the channel", {
      status: 500,
    });
  }
}
