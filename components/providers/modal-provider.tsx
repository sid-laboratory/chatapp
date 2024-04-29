"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { useModal } from "@/hooks/use-modal-store";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MemberModal } from "../modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServer } from "@/components/modals/leave-server-modal";
import { DeleteServer } from "@/components/modals/delete-server-modal";
import { DeleteChannel } from "@/components/modals/delete-channel-modal";
import { EditChannel } from "@/components/modals/edit-channel-modal";

export const ModalProvider = () => {
  const { isOpen, type, onClose } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {type === "createServer" && <CreateServerModal />}
      {type === "invite" && <InviteModal />}
      {type === "editServer" && <EditServerModal />}
      {type === "member" && <MemberModal />}
      {type === "channel" && <CreateChannelModal />}
      {type === "leaveServer" && <LeaveServer />}
      {type === "deleteServer" && <DeleteServer />}
      {type === "deleteChannel" && <DeleteChannel />}
      {type === "editChannel" && <EditChannel />}
    </>
  );
};
