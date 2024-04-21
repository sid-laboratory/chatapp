"use client";
import qs from "query-sring";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal-store";
import { UseOrigin } from "@/hooks/use-origin";
import "./selection.css";
import { ServerWithMembers } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { MemberRole } from "@prisma/client";

export const MemberModal = () => {
  const RoleIconMap = {
    GUEST: "👤",
    MODERATOR: "🛠️",
    ADMIN: "🛡️",
  };

  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const origin = UseOrigin();

  const isModalOpen = isOpen && type === "member";
  const { server } = data as { server: ServerWithMembers };

  const onRoleChange = async (role: MemberRole, memberId: string) => {
    try {
      setLoadingId(memberId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black  overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-center">
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="  mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gay-y-1">
                  {member.profile.name !== null && ( // Check if name is not null
                    <div className="text-md font-semibold flex items-center gap-x-3">
                      {member.profile.name.includes(" ") ? ( // Check if name contains a space
                        <>
                          {member.profile.name.split(" ")[0]}{" "}
                          {member.profile.name.split(" ")[1] !== "null" && (
                            <> {member.profile.name.split(" ")[1]}</>
                          )}
                        </>
                      ) : (
                        member.profile.name
                      )}
                      {RoleIconMap[member.role]}
                    </div>
                  )}
                  <p className="text-sm text-zinc-900/70">
                    {member.profile.email}
                  </p>
                </div>

                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto " />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ShieldCheck className="w-4 h-4 mr-2" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto " />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Gavel className="w-4 h-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
