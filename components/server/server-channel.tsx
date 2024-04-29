"use client";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
  channeltype: ChannelType;
}

const ServerChannel = ({
  channel,
  server,
  role,
  channeltype,
}: ServerChannelProps) => {
  const { onOpen, onClose, data } = useModal();
  const params = useParams();
  const router = useRouter();

  interface onClickProps {
    id: string;
  }

  const handleClick = ({ id }: onClickProps) => {
    router.push(`/server/${params?.serverId}/channels/${id}`);
  };
  const handleEdit =
    ({ id }: onClickProps) =>
    () => {
      console.log("Edit", id);
      onOpen("editChannel", { channel, server });
    };
  const handleDelete =
    ({ id }: onClickProps) =>
    () => {
      console.log("Delete", id, channel.name);
      onOpen("deleteChannel", { channel, server });
    };

  return (
    <>
      <div className="flex flex-1 gap-x-1 pr-2 group ">
        <ActionTooltip label={channel.name} side="top">
          <button
            onClick={() => handleClick({ id: channel.id })}
            className={cn(
              "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"
            )}
          >
            {channeltype === ChannelType.TEXT && (
              <Hash className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )}
            {channeltype === ChannelType.VOICE && (
              <Mic className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )}
            {channeltype === ChannelType.VIDEO && (
              <Video className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            )}
            <p
              className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id &&
                  "text-primary dark:text-zinc-200 dark:group-hover:text-white"
              )}
            >
              {channel.name}
            </p>
          </button>
        </ActionTooltip>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <div className=" ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit
                onClick={handleEdit({ id: channel.id })}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition hover:cursor-pointer "
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={handleDelete({ id: channel.id })}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition hover:cursor-pointer"
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default ServerChannel;
