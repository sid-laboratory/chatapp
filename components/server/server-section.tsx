"use client";

import { ServerWithMembers } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembers;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="group flex items-centerx justify-between py-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 ml-2 mt-2">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() => onOpen("channel")}
              className="hover:bg-stone-700 hover:rounded-full rounded full p-2  text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition mr-2 "
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}

        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage Members" side="top">
            <button
              onClick={() => onOpen("member", { server })}
              className="hover:bg-stone-700 hover:rounded-full rounded full p-2  text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition mr-2 "
            >
              <Settings className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
        {/* //-------------------------------------------------------------------------------- */}
      </div>
    </>
  );
};

export default ServerSection;
