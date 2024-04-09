import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile = await initialProfile();
  console.log("here is the received profile", profile);
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }
  console.log(profile);
  return (
    <>
      <div>Create a Server</div>
    </>
  );
};

export default SetupPage;
