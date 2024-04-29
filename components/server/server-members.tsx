"use client";

import { MemberRole, Server } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { useRouter } from "next/navigation";

interface ServerMembersProps {
  server: Server;
  role?: MemberRole;
  name: string;
  url: string;
  memberId: string;
}

const ServerMembers = ({
  server,
  role,
  name,
  url,
  memberId,
}: ServerMembersProps) => {
  const params = useParams();
  const router = useRouter();

  const handleConversation = () => {
    router.push(`/server/${params?.serverId}/conversations/${memberId}`);
  };

  return (
    <>
      <ActionTooltip label={name} side="right">
        <button
          // onClick={() => handleClick({ id: channel.id })}
          className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId === memberId && "bg-zinc-700/20 dark:bg-zinc-700"
          )}
          onClick={handleConversation}
        >
          <UserAvatar src={url} className="w-2 h-2" />
          <p
            className={cn(
              "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all",
              params?.memberId === memberId &&
                "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
          >
            {name}
          </p>
          {role === MemberRole.ADMIN && "🛡️"}
          {role === MemberRole.MODERATOR && "🛠️"}
          {role === MemberRole.GUEST && "👤"}
        </button>
      </ActionTooltip>
    </>
  );
};

export default ServerMembers;
