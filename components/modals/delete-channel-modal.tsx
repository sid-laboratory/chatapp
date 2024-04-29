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
import qs from "query-string";
import "./selection.css";

export const DeleteChannel = () => {
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = UseOrigin();
  const Router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  console.log("This is the channel that you want to delete ", channel?.name);

  const handleLeaveServer = async () => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}/leave`,
        query: {
          serverId: server?.id,
        },
      });
      console.log("This is the url ", url);
      await axios.delete(url);
      onClose();
      Router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Delete Channel!
            </DialogTitle>
            <DialogDescription className="text-stone-700 text-center">
              Are you sure you want to leave{" "}
              <span className="font-semibold text-indigo-700/80">
                {channel?.name}{" "}
              </span>
              Channel
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
