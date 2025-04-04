import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import { MenuItem } from "@/types/dashboard";

interface DashboardMenuProps {
  role: string;
}

// Base menu items for all users
const menuItems: MenuItem[] = [
  {
    href: "/dashboard/user/my-account",
    title: "Min Konto",
    desc: "Endre konto informasjon",
  },
  {
    href: "/dashboard/user/reservations",
    title: "Mine reservasjoner",
    desc: "Administrer reservasjoner",
  },
  {
    href: "/dashboard/user/payments",
    title: "Mine betalinger",
    desc: "Se betalinger gjort",
  },
  {
    href: "/dashboard/user/donate",
    title: "Donering",
    desc: "Se dine tidligere donasjoner og doner",
  },
  {
    href: "/dashboard/user/blogg",
    title: "Administrer blogg",
    desc: "Se, endre, legge til og slette dine delte innlegg",
  },
];

// Admin specific items
const adminItems: MenuItem[] = [
  {
    href: "/dashboard/admin/users",
    title: "Administrer brukere",
    desc: "Se, legge til, arkivere brukere",
  },
  {
    href: "/dashboard/admin/sponsors",
    title: "Våre sponsorer",
    desc: "Se, legg til kontakt info til sponsorer",
  },
  {
    href: "/dashboard/admin/store",
    title: "Nettbutikk",
    desc: "Link til strapi for adminstrering av nettbutikk",
  },
  {
    href: "/dashboard/admin/events",
    title: "Administrer arrangementer",
    desc: "Fiks alt innholdet som prosjekter, eventer og blogger",
  },
  {
    href: "/dashboard/admin/projects",
    title: "Administrer prosjekter",
    desc: "Fiks alt innholdet som prosjekter, eventer og blogger",
  },
  {
    href: "/dashboard/admin/bloggAdmin",
    title: "Adminsitrer blogger",
    desc: "Fiks alt innholdet som prosjekter, eventer og blogger",
  },
];

export default function DashboardMenu({ role }: DashboardMenuProps) {
  // Get all menu items based on role
  const getVisibleMenuItems = (): MenuItem[] => {
    let visibleItems = [...menuItems];

    if (role === "admin") {
      visibleItems = [...visibleItems];
    }

    return visibleItems;
  };

  return (
    <section className="mx-auto p-4 w-screen flex flex-col items-center gap-5">
      <div className="flex items-center w-screen pb-5">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Administration</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </div>

      {/* All regular and role-specific menu items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>

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
