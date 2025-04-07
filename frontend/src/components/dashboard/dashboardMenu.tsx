import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import { menuItems, adminItems } from "./administerItems";

interface DashboardMenuProps {
  role: string;
}

export default function DashboardMenu({ role }: DashboardMenuProps) {
  // Get all menu items based on role
  const getVisibleMenuItems = () => {
    let visibleItems = [...menuItems];

    if (role === "admin") {
      visibleItems = [...visibleItems];
    }

    return visibleItems;
  };

  return (
    <section className="mx-auto p-4 w-screen flex flex-col items-center gap-5">
      <section className="flex items-center w-screen pb-5">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Administration</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </section>

      {/* All regular and role-specific menu items */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {getVisibleMenuItems().map((item) => (
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
      </section>

      {/* Admin section */}
      {role === "admin" && (
        <section>
          <div className="flex py-5 items-center w-screen">
            <div className="flex-grow border-t-4 border-green-400"></div>
            <span className="flex-shrink mx-4 text-red-900">
              Only for Admin
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
