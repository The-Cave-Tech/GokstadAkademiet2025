import DashboardProfile from "./dashboardProfile";
import DashboardMenu from "./dashboardMenu";
import { DashboardProps } from "@/types/dashboard";

export default function Dashboard({
  profile,
  role,
  isLoading,
}: DashboardProps) {
  if (isLoading) return <p className="text-center m-9 text-2xl">Loading...</p>;
  if (!profile) return <p className="text-center m-9">No profile found</p>;

  return (
    <section className="grid gap-5 my-10 justify-center">
      <DashboardProfile profile={profile} />
      <DashboardMenu role={role} />
    </section>
  );
}
