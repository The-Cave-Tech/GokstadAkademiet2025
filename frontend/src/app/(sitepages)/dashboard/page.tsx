"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/dashboard";
import { fetchUserProfile } from "@/lib/services/strapiProfileData";
import AuthCard from "@/components/ui/AuthCard";
import Link from "next/link";

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Call function to fetch user profile
    const fetchData = async () => {
      const profileData = await fetchUserProfile();
      setProfile(profileData);
    };
    console.log(profile);
    fetchData();
  }, []);

  if (!profile) return <p>Loading.....</p>;

  return (
    <section className="flex flex-col justify-center items-center">
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
      <div className="relative flex py-5 items-center w-[100%]">
        <div className="flex-grow border-t-4 border-green-400"></div>
        <span className="flex-shrink mx-4 text-red-900">Adminstration</span>
        <div className="flex-grow border-t-4 border-green-400"></div>
      </div>
      <section className="w-10/12 h-10/10 flex flex-wrap justify-center">
        <Link href="/dashboard/user/personalInfo">
          <AuthCard
            header={<h1>My personal info</h1>}
            content={
              <section className="flex gap-5">
                <div>Test1</div>
                <div>Test2</div>
                <div></div>
              </section>
            }
            footer
          />
        </Link>
        <AuthCard
          header={<h1>This is card link</h1>}
          content={
            <section className="flex gap-5">
              <div>Test1</div>
              <div>Test2</div>
              <div></div>
            </section>
          }
          footer
        />
        <AuthCard
          header={<h1>This is card link</h1>}
          content={
            <section className="flex gap-5">
              <div>Test1</div>
              <div>Test2</div>
              <div></div>
            </section>
          }
          footer
        />
        <AuthCard
          header={<h1>This is card link</h1>}
          content={
            <section className="flex gap-5">
              <div>Test1</div>
              <div>Test2</div>
              <div></div>
            </section>
          }
          footer
        />
        <AuthCard
          header={<h1>This is card link</h1>}
          content={
            <section className="flex gap-5">
              <div>Test1</div>
              <div>Test2</div>
              <div></div>
            </section>
          }
          footer
        />
      </section>
    </section>
  );
}
