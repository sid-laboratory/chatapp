import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("You are not authorized to delete members", {
        status: 401,
      });
    }
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server id is required", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member id is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    return new NextResponse(
      "There is some internal error in deleting members",
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("You are not authorized to update members", {
        status: 401,
      });
    }

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server id is required", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member id is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(server), { status: 200 }); // Corrected response format
  } catch (error) {
    console.log(error);
    return new NextResponse(
      "There is some internal error in updating members",
      { status: 500 }
    );
  }
}
