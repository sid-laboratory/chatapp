"use client";

import { MemberRole, Server } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ServerMembersProps {
  server: Server;
  role?: MemberRole;
  name: string;
}

const ServerMembers = ({ server, role, name }: ServerMembersProps) => {
  const params = useParams();
  return (
    <>
      <ActionTooltip label={name} side="right">
        <button
          // onClick={() => handleClick({ id: channel.id })}
          className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"
          )}
        >
          {role === MemberRole.ADMIN && "🛡️"}
          {role === MemberRole.MODERATOR && "🛠️"}
          {role === MemberRole.GUEST && "👤"}
          <p
            className={cn(
              "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all"
            )}
          >
            {name}
          </p>
        </button>
      </ActionTooltip>
    </>
  );
};

export default ServerMembers;
