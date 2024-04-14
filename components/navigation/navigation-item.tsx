"use client";

import Image from "next/image";
import { redirect, useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import "./animation.css";

interface NavigationItemProps {
  name: string;
  imageUrl: string;
  id: string;
}

const NavigationItem = ({ name, imageUrl, id }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/server/${id}`);
  };

  return (
    <>
      <ActionTooltip side="right" align="center" label={name}>
        <button onClick={onClick} className="group relative flex items-center">
          <div
            className={cn(
              "absolute left-0 bg-white  transition-all w-[4px]",
              params?.serverId !== id &&
                "group-hover:h-[20px] group-hover:bg-emerald-500 group-hover:animate-bounce ",
              params?.serverId === id ? "h-[36px]" : "h-[0px]"
            )}
          />
          <div
            className={cn(
              "relative group flex mx-3 mr-3 h-[48px] w-[48px] rounded-[24px] group-hover :rounded-[16px] transition-all overflow-hidden",
              params?.serverId === id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image fill src={imageUrl} alt={name} />
          </div>
        </button>
      </ActionTooltip>
    </>
  );
};

export default NavigationItem;
