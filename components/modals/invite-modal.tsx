"use client";
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
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { UseOrigin } from "@/hooks/use-origin";
import "./selection.css";

export const InviteModal = () => {
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = UseOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      if (!response) {
        throw new Error("Failed to generate invite link");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Invite Friends!
            </DialogTitle>
            <DialogDescription className="text-stone-700 text-center">
              Invite your friends to join your server
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <Label className=" uppercase text-xs font-semibold text-neutral-700 dark:text-neutral-700">
              Server Invite Link
            </Label>
            <div className="flex items-center mt-2 gap-x-2 mb-5">
              <Input
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 outline-none focus:ring-0"
                value={inviteUrl}
                disabled={isLoading}
              />
              <Button
                disabled={isLoading}
                className=""
                size="icon"
                onClick={handleCopy}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
