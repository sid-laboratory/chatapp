"use client";
import { useToast } from "@/components/ui/use-toast";
import qs from "query-string";
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
import axios from "axios";
import { useRouter } from "next/navigation";

export const MemberModal = () => {
  const { toast } = useToast();
  const router = useRouter();

  const RoleIconMap = {
    GUEST: "👤",
    MODERATOR: "🛠️",
    ADMIN: "🛡️",
  };

  const callToast = (type: "kick" | "mod" | "guest") => {
    if (type === "kick") {
      toast({
        variant: "success",
        title: "SUCCESS!",
        description: "Member kicked out of the server successfully",
      });
    } else if (type === "guest") {
      toast({
        variant: "destructive",
        title: "Degrade!",
        description: "Member degraded to guest",
      });
    } else {
      toast({
        variant: "success",
        title: "Upgrade!",
        description: "Member upgraded to moderator",
      });
    }
  };

  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const origin = UseOrigin();

  const isModalOpen = isOpen && type === "member";
  const { server } = data as { server: ServerWithMembers };

  const onRoleChange = async (role: MemberRole, memberId: string) => {
    try {
      setLoadingId(memberId);
      console.log("this is server info ", server, server?.name);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("member", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
    const memberRole = role === "GUEST" ? "guest" : "mod";
    callToast(memberRole);
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("member", { server: response.data });
      callToast("kick");
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange("GUEST", member.id)
                                  }
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto " />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange("MODERATOR", member.id)
                                  }
                                >
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
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
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
