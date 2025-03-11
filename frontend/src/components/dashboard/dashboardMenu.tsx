import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import { MenuItem } from "@/types/dashboard";

interface DashboardMenuProps {
  role: string;
}

const menuItems: MenuItem[] = [
  {
    href: "/dashboard/user/personalInfo",
    title: "My Personal Info",
    desc: "All my personal info",
  },
  {
    href: "/dashboard/user/myEvents",
    title: "My Events",
    desc: "We are gonna have a blast",
  },
  { href: "/dashboard/user/myPosts", title: "My Posts", desc: "All my posts" },
  {
    href: "/dashboard/user/myEvents",
    title: "My Events",
    desc: "We are gonna have a blast",
  },
];

const adminItems: MenuItem[] = [
  {
    href: "/dashboard/admin/users",
    title: "Every registered user",
    desc: "Check all users on your system",
  },
  {
    href: "/dashboard/admin/posts",
    title: "Every user's posts",
    desc: "Check everything that has been posted",
  },
];

export default function DashboardMenu({ role }: DashboardMenuProps) {
  return (
    <section className="mx-auto p-4 w-screen flex flex-col items-center gap-5">
      <div className="flex items-center w-screen pb-5">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Adminstration</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4 max-w-[350px]"
              header={<h1 className="text-left">{item.title}</h1>}
              content={<p className="text-left">{item.desc}</p>}
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
        ))}
      </div>

      {role === "admin" && (
        <section>
          <div className="flex py-5 items-center w-screen">
            <div className="flex-grow border-t-4 border-green-400"></div>
            <span className="flex-shrink mx-4 text-red-900">
              Only for admin
            </span>
            <div className="flex-grow border-t-4 border-green-400"></div>
          </div>
          <article className="mx-auto p-4 grid justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {adminItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <AuthCard
                    className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
                    header={<h1 className="text-left">{item.title}</h1>}
                    content={<p className="text-left">{item.desc}</p>}
                    footer={
                      <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                        <p>Pil</p>
                      </aside>
                    }
                  />
                </Link>
              ))}
            </div>
          </article>
        </section>
      )}
    </section>
  );
}
