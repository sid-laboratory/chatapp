"use client";

import { ServerWithMembers } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { useParams } from "next/navigation";

interface ServerHeaderProps {
  server: ServerWithMembers;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const params = useParams();
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isMod = role === MemberRole.ADMIN || role === MemberRole.MODERATOR;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinz-700/10 dark:hover:bg-zinc-700/50 transition">
            {server.name.toUpperCase()}
            <ChevronDown className=" h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {isMod && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]"
            >
              Invite People!
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem className=" px-3 py-2 text-white text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]">
              Server settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem className=" px-3 py-2 text-white text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]">
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isMod && (
            <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]">
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isMod && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem className=" text-rose-500 px-3 py-2 text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]">
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem className=" text-rose-500 px-3 py-2 text-sm cursor-pointer bg-[#0f172a] rounded-[16px] w-[100%]">
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ServerHeader;
