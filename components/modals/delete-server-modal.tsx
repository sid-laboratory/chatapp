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
import { Check, Copy, RefreshCw, Router } from "lucide-react";
import { UseOrigin } from "@/hooks/use-origin";
import "./selection.css";

export const DeleteServer = () => {
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = UseOrigin();
  const Router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const handleLeaveServer = async () => {
    try {
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      Router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Leave Server!
            </DialogTitle>
            <DialogDescription className="text-stone-700 text-center">
              Are you sure you want to leave{" "}
              <span className="font-semibold text-indigo-700/80">
                {server?.name}
              </span>
              server
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLeaveServer}
                disabled={isLoading}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
