import { MenuItem } from "@/types/dashboard";
// Base menu items for all users
export const menuItems: MenuItem[] = [
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
export const adminItems: MenuItem[] = [
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
    title: "Administrere arrangementer",
    desc: "Se alle, legge til, fjerne og oppdatere arrangementer",
  },
  {
    href: "/dashboard/admin/store",
    title: "Nettbutikk",
    desc: "Link til strapi for adminstrering av nettbutikk",
  },
  {
    href: "/dashboard/admin/content",
    title: "Innholdshåndtering",
    desc: "Fiks alt innholdet som prosjekter, eventer og blogger",
  },
];
