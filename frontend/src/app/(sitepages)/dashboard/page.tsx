"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/dashboard";
import { fetchUserProfile } from "@/lib/data/services/strapiProfileData";
import AuthCard from "@/components/ui/AuthCard";
import Link from "next/link";

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState(""); // Should be context with role from strapi

  useEffect(() => {
    // Call function to fetch user profile
    const fetchData = async () => {
      const profileData = await fetchUserProfile();
      setProfile(profileData);
      setRole("admin"); // Will be used with context later
    };
    console.log(profile);
    fetchData();
  }, []);

  if (!profile) return <p>Loading.....</p>;

  return (
    <section className="grid gap-5 my-10 justify-center items-center px-10">
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div>
          {/* Background Image */}
          {profile.backgroundImage && (
            <div
              className="absolute top-0 left-0 right-0 h-64 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${profile.backgroundImage.url})` }}
            />
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-5xl">{profile.profileName}</h1>
          <p className="text-center">{profile.bio}</p>
        </div>
      </section>
      <div className="flex items-center">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Adminstration</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </div>
      <section className="mx-auto p-4" aria-label="Administer your page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My personal Info</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>All my personal info</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>All my events</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myPosts">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My posts</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>All my posts</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>We are gonna have a blast</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>We are gonna have a blast</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>We are gonna have a blast</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>We are gonna have a blast</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
          <Link href="/dashboard/user/myEvents">
            <AuthCard
              className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
              header={<h1 className="text-left">My events</h1>}
              content={
                <section className="text-left space-y-2">
                  <p>We are gonna have a blast</p>
                </section>
              }
              footer={
                <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                  <p>Pil</p>
                </aside>
              }
            />
          </Link>
        </div>
      </section>
      {/* Section only for admin role */}
      {role === "admin" && (
        <section aria-label="Administer system">
          <div className="flex py-5 items-center md:min-w-[100vw]">
            <div className="flex-grow border-t-4 border-green-400"></div>
            <span className="flex-shrink mx-4 text-red-900">
              Only for admin
            </span>
            <div className="flex-grow border-t-4 border-green-400"></div>
          </div>
          <article className="mx-auto p-4 grid justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href="/dashboard/admin/users">
                <AuthCard
                  className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
                  header={<h1 className="text-left">Every registered user</h1>}
                  content={
                    <section className="text-left space-y-2">
                      <p>Check all users on your system</p>
                    </section>
                  }
                  footer={
                    <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                      <p>Pil</p>
                    </aside>
                  }
                />
              </Link>
              <Link href="/dashboard/admin/posts">
                <AuthCard
                  className="relative flex flex-col bg-cyan-200 shadow-lg shadow-cyan-500/50 p-4"
                  header={<h1 className="text-left">Every users posts</h1>}
                  content={
                    <section className="text-left space-y-2">
                      <p>Check everything that has been posted</p>
                    </section>
                  }
                  footer={
                    <aside className="absolute bottom-5 right-5 text-gray-500 text-sm">
                      <p>Pil</p>
                    </aside>
                  }
                />
              </Link>
            </div>
          </article>
        </section>
      )}
    </section>
  );
}
