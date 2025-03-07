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
    <section className="grid gap-5 my-10">
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
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
          <Link href="/dashboard/user/personalInfo">
            <AuthCard
              className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-60"
              header={<h1>My personal info</h1>}
              content={
                <section className="flex gap-5">
                  <section className="flex flex-col gap-5">
                    <p>We are gonna have a blast</p>
                  </section>
                </section>
              }
              footer
            />
          </Link>
        </div>
      </section>
      {/* Section only for admin role */}
      {role === "admin" && (
        <section aria-label="Administer system">
          <div className="flex py-5 items-center w-[100vw]">
            <div className="flex-grow border-t-4 border-green-400"></div>
            <span className="flex-shrink mx-4 text-red-900">
              Only for admin
            </span>
            <div className="flex-grow border-t-4 border-green-400"></div>
          </div>
          <article className="mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href="/dashboard/admin/personalInfo">
                <AuthCard
                  className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-70"
                  header={<h1>Administrate users</h1>}
                  content={
                    <section className="flex gap-5">
                      <section className="flex flex-col gap-5">
                        <p>We are gonna have a blast</p>
                        <p>Change memberships</p>
                      </section>
                    </section>
                  }
                  footer
                />
              </Link>
              <Link href="/dashboard/admin/personalInfo">
                <AuthCard
                  className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-70"
                  header={<h1>Bought items</h1>}
                  content={
                    <section className="flex flex-col gap-5">
                      <p>We are gonna have a blast</p>
                      <p>Look at items bought</p>
                    </section>
                  }
                  footer
                />
              </Link>
              <Link href="/dashboard/admin/personalInfo">
                <AuthCard
                  className="flex flex-col justify-center items-center bg-cyan-200 shadow-lg shadow-cyan-500/50 size-70"
                  header={<h1>Change events</h1>}
                  content={
                    <section className="flex flex-col gap-5">
                      <p>We are gonna have a blast</p>
                    </section>
                  }
                  footer
                />
              </Link>
            </div>
          </article>
        </section>
      )}
    </section>
  );
}
