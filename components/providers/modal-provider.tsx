"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { useModal } from "@/hooks/use-modal-store";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MemberModal } from "../modals/members-modal";

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
    </>
  );
};
