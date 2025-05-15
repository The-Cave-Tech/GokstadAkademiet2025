"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

export default function DashboardMenu() {
  const { userRole } = useAuth();

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
      desc: "Se dine tidligere donasjoner og doner",
    },
    {
      href: "/dashboard/blogg",
      title: "Mine Blogger",
      desc: "Se og administrer blogginnlegg",
    },
  ];

  const adminItems = [
    {
      href: "/dashboard/admin/events",
      title: "Administrer Eventer",
      desc: "Se, legg til, endre eventer",
    },
    {
      href: "/dashboard/admin/projects",
      title: "Administrer Prosjekter",
      desc: "Se, legg til, endre prosjekter",
    },
    {
      href: "/dashboard/admin/blog",
      title: "Administrer Blogger",
      desc: "Se alle blogger og slett",
    },
    {
      href: `${process.env.NEXT_PUBLIC_STRAPI_STORE_URL}/content-manager/collection-types/api::product.product`,
      title: "Nettbutikk",
      desc: "Administrer nettbutikk",
    },
  ];

  const isAdmin = userRole === "Admin/moderator/superadmin";
  // Ingen filtrering nødvendig siden /dashboard/user/blogg er fjernet fra baseMenuItems
  const filteredBaseMenuItems = baseMenuItems;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-10">
      {/* Bruker Panel */}
      <div>
        <h2 className="text-section-title-small font-semibold text-typographyPrimary mb-4 text-center sm:text-left">
          Bruker Panel
        </h2>
        <div className="grid grid-cols-1 bg-secondary rounded-lg p-lg sm:grid-cols-2 gap-6">
          {baseMenuItems.map((item) => (
            <Link key={item.href} href={item.href} className="no-underline">
              <Card className="relative flex flex-col shadow-md p-4 h-full bg-background rounded-lg">
                <CardHeader>
                  <h3 className="text-dashboard-header text-typographyPrimary font-semibold">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-dashboard-body-small text-typographySecondary">
                    {item.desc}
                  </p>
                </CardBody>
                <CardFooter>
                  <aside className="absolute bottom-4 right-4 text-typographySecondary text-dashboard-body-small">
                    →
                  </aside>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div>
          <h2 className="text-section-title-small font-semibold text-danger mb-4 text-center sm:text-left">
            Admin Panel
          </h2>
          <div className="grid grid-cols-1 bg-secondary rounded-lg p-lg sm:grid-cols-2 gap-6">
            {adminItems.map((item) => (
              <Link key={item.href} href={item.href} className="no-underline">
                <Card className="relative flex flex-col shadow-md p-4 h-full bg-background rounded-lg">
                  <CardHeader>
                    <h3 className="text-dashboard-header text-typographyPrimary font-semibold">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body-small text-typographySecondary">
                      {item.desc}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <aside className="absolute bottom-4 right-4 text-typographySecondary text-body-small">
                      →
                    </aside>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
