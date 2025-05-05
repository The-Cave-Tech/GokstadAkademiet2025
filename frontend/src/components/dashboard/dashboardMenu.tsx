"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardMenu() {
  const { isAuthenticated, isAdmin, refreshAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Refresh auth status when component mounts
    refreshAuthStatus();
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, refreshAuthStatus, router]);

  const baseMenuItems = [
    {
      href: "/dashboard/my-account",
      title: "Min Konto",
      desc: "Endre konto informasjon",
    },
    {
      href: "/dashboard/payments",
      title: "Mine betalinger",
      desc: "Se betalinger gjort",
    },
    {
      href: "/dashboard/reservations",
      title: "Mine reservasjoner",
      desc: "Administrer reservasjoner",
    },
    {
      href: "/dashboard/donate",
      title: "Donasjoner",
      desc: "Se dine tidligere donasjoner og doner",
    },
    {
      href: "/dashboard/favorite",
      title: "Mine favoritter",
      desc: "Se dine favoritter",
    },
    {
      href: "/dashboard/blogg",
      title: "Mine Blogger",
      desc: "Se og administrer blogginnlegg",
    },
  ];

  const adminItems = [
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
      href: "/dashboard/admin/events",
      title: "Administrer Eventer",
      desc: "Se, legg til, endre eventer",
    },{
      href: "/dashboard/admin/prosjekts",
      title: "Administrer Prosjekter",
      desc: "Se, legg til, endre prosjekter",
    },
    {
      href: "/dashboard/admin/blogg",
      title: "Administrer Blogger",
      desc: "Se alle blogger og slett",
    },
    {
      href: "/dashboard/admin/nets",
      title: "Nettbutikk",
      desc: "Administrer nettbutikk",
    },
  ];

  // If not authenticated yet, show loading or nothing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="mx-auto p-4 w-full flex flex-col items-center gap-5">
      <div className="flex items-center w-full pb-5">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Bruker Panel</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {baseMenuItems.map((item) => (
          <Link key={item.href} href={item.href} className="no-underline">
            <Card className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4 max-w-[350px] h-full">
              <CardHeader>
                <h1 className="text-left">{item.title}</h1>
              </CardHeader>
              <CardBody>
                <p className="text-left">{item.desc}</p>
              </CardBody>
              <CardFooter>
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  →
                </aside>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {isAdmin && (
        <section className="w-full">
          <div className="flex py-5 items-center w-full">
            <div className="flex-grow border-t-4 border-green-400"></div>
            <span className="flex-shrink mx-4 text-red-900">Admin Panel</span>
            <div className="flex-grow border-t-4 border-green-400"></div>
          </div>
          <article className="mx-auto p-4 grid justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {adminItems.map((item) => (
                <Link key={item.href} href={item.href} className="no-underline">
                  <Card className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4 h-full">
                    <CardHeader>
                      <h1 className="text-left">{item.title}</h1>
                    </CardHeader>
                    <CardBody>
                      <p className="text-left">{item.desc}</p>
                    </CardBody>
                    <CardFooter>
                      <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                        →
                      </aside>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </article>
        </section>
      )}
    </section>
  );
}
