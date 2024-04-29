import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";
import { Hash, Mic, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ServerSection from "@/components/server/server-section";
import ServerChannel from "@/components/server/server-channel";
import ServerMembers from "@/components/server/server-members";
import { ServerWithMembers } from "@/types";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VOICE]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: "🛡️",
  [MemberRole.MODERATOR]: "🛠️",
  [MemberRole.GUEST]: "👤",
};

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },

    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },

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

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const voiceChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const memebers = server?.members;

  if (!server) {
    return redirect("/");
  }

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  console.log("This is my role", role);

  return (
    <>
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#27272a] bg-[#F2F3F5]">
        <ScrollArea className="flex px-3 ">
          <ServerHeader server={server} role={role} />
          <div className="m-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: voiceChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: memebers?.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
          <Separator className="bg-zinc-700 my-2 dark:bg-zinc-600" />
          {
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.TEXT}
                role={role}
                label="Text Channels"
              />
              {textChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                  channeltype={ChannelType.TEXT}
                />
              ))}
            </div>
          }
          <Separator className="bg-zinc-700 my-2 dark:bg-zinc-600" />
          {
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.VOICE}
                role={role}
                label="Voice Channels"
              />
              {voiceChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                  channeltype={ChannelType.VOICE}
                />
              ))}
            </div>
          }
          <Separator className="bg-zinc-700 my-2 dark:bg-zinc-600" />
          {
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.VIDEO}
                role={role}
                label="Video Channels"
              />
              {videoChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                  channeltype={ChannelType.VIDEO}
                />
              ))}
            </div>
          }
          <Separator className="bg-zinc-700 my-2 dark:bg-zinc-600" />
          {
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                role={role}
                label="Channel Members"
                server={server}
              />
              <div className="space-y-[2px]">
                {memebers?.map((member) => (
                  <ServerMembers
                    key={member.profile.id}
                    role={member.role}
                    name={member.profile.name}
                    server={server}
                    url={member.profile.imageUrl}
                    memberId={member.id}
                  />
                ))}
              </div>
            </div>
          }
        </ScrollArea>
      </div>
    </>
  );
};

export default ServerSidebar;
