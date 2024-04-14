import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";
const NavigationSideBar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  return (
    <>
      <div className="space-y-4 flex flex-col items-center h-full bg-[#37474F] rounded-r-[20px] text-primary w-full dark:bg-[#1E1F22] py-2">
        <NavigationAction />
        <Separator className="h-[3px] bg-zinc-800 dark:bg-zinc-800 rounded-md w-12 mx-auto" />
        <ScrollArea className="flex-1 w-full">
          {server.map((server) => {
            return (
              <div key={server.id} className="mb-4">
                <NavigationItem
                  name={server.name}
                  imageUrl={server.imageUrl}
                  id={server.id}
                />
              </div>
            );
          })}
        </ScrollArea>
        <div className="gap-y-4 flex flex-col items-center">
          <ModeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-[48px] w-[48px]",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NavigationSideBar;
