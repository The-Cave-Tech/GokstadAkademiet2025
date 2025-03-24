import Link from "next/link";
import AuthCard from "@/components/ui/AuthCard";
import { MenuItem } from "@/types/dashboard";

interface DashboardMenuProps {
  role: string;
}

// Base menu items for all users
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
  {
    href: "/dashboard/user/myPosts",
    title: "My Posts",
    desc: "All my posts",
  },
  {
    href: "/dashboard/user/reservations",
    title: "My reservations",
    desc: "We are gonna have a blast",
  },
  {
    href: "/dashboard/user/payments",
    title: "View my payment history",
    desc: "We are gonna have a blast",
  },
];

// Member level 1 specific items
const memberLevel1Items: MenuItem[] = [
  {
    href: "/dashboard/member/discount",
    title: "Member Discounts",
    desc: "Special discounts for Level 1 members",
  },
  {
    href: "/dashboard/member/special-events",
    title: "Member Events",
    desc: "Exclusive events for members",
  },
];

// Member level 2 specific items
const memberLevel2Items: MenuItem[] = [
  {
    href: "/dashboard/premium/vip-access",
    title: "VIP Access",
    desc: "Premium access to VIP features",
  },
  {
    href: "/dashboard/premium/priority-support",
    title: "Priority Support",
    desc: "Get help faster with priority support",
  },
  {
    href: "/dashboard/premium/exclusive-content",
    title: "Exclusive Content",
    desc: "Content only for premium members",
  },
];

// Admin specific items
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
  // Get all menu items based on role
  const getVisibleMenuItems = (): MenuItem[] => {
    let visibleItems = [...menuItems];

    if (role === "user_member_1" || role === "admin") {
      visibleItems = [...visibleItems, ...memberLevel1Items];
    }

    if (role === "user_member_2" || role === "admin") {
      visibleItems = [...visibleItems, ...memberLevel2Items];
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
