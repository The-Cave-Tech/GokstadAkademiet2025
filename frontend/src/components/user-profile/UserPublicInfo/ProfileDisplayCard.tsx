"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";
import { getProfileImageUrl } from "@/lib/data/services/profileSections/publicProfileService";
import { getUserCredentials } from "@/lib/data/services/userProfile";
import type { ProfileDisplayCardProps, CardSize } from "@/types/ProfileDisplayCard.types";

const sizeStyles: Record<CardSize, {
  title: string; text: string; contactGap: string; cardGap: string;
}> = {
  sm: { title: "text-2xl", text: "text-sm", contactGap: "gap-4", cardGap: "gap-6" },
  md: { title: "text-3xl", text: "text-base", contactGap: "gap-6", cardGap: "gap-8" },
  lg: { title: "text-4xl", text: "text-lg", contactGap: "gap-8", cardGap: "gap-10" },
};

export default function ProfileDisplayCard({
  profile,
  size = "md",
  avatarSize = 200,
  showBio = true,
  showIcons = true,
  className,
}: ProfileDisplayCardProps) {
  const s = sizeStyles[size];

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  useEffect(() => {
    if (!profile?.publicProfile?.showEmail) {
      setEmail(undefined);
      return;
    }

    setIsLoadingEmail(true);
    getUserCredentials()
      .then((c) => {
        if (c?.email) {
          setEmail(c.email);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch email:", error);
      })
      .finally(() => {
        setIsLoadingEmail(false);
      });
  }, [profile?.publicProfile?.showEmail]);

  const { phoneNumber, streetAddress = "", postalCode = "", city = "" } =
    profile?.personalInformation ?? {};
  const address = [streetAddress, postalCode, city].filter(Boolean).join(", ");
  const displayName = profile?.publicProfile?.displayName ?? "Bruker";

  const contact = [
    profile?.publicProfile?.showEmail && email && { icon: "email", label: email, href: `mailto:${email}` },
    profile?.publicProfile?.showPhone && phoneNumber && { icon: "phone", label: phoneNumber },
    profile?.publicProfile?.showAddress && address && { icon: "location", label: address },
  ].filter(Boolean) as { icon: string; label: string; href?: string }[];

  // Fallback UI while profile is loading
  if (!profile) {
    return (
      <Card className={`flex flex-col md:flex-row ${s.cardGap} items-start break-words ${className ?? ""}`}>
        <div className="p-4">Laster profil...</div>
      </Card>
    );
  }

  return (
    <Card
      aria-labelledby={`${displayName}-heading`}
      className={`flex flex-col md:flex-row ${s.cardGap} items-start break-words ${className ?? ""}`}
    >
      <CardHeader className="p-0">
        <figure
          aria-label="Profilbilde"
          style={{ width: avatarSize, height: avatarSize }}
          className="relative overflow-hidden rounded-[32px]"
        >
          <Image
            src={getProfileImageUrl(profile)}
            alt={displayName}
            fill
            sizes={`${avatarSize}px`}
            className="object-cover"
          />
        </figure>
      </CardHeader>

      <div className="flex-1 flex flex-col">
        <CardBody className="p-0 flex flex-col">
          <div>
            <h2
              id={`${displayName}-heading`}
              className={`${s.title} font-extrabold leading-snug mb-1`}
            >
              {displayName}
            </h2>
          </div>

          {contact.length > 0 && (
            <div className="mt-1">
              <ul className={`flex flex-row items-center ${s.contactGap}`}>
                {contact.map(({ icon, label, href }) => (
                  <li key={label} className={`flex items-center gap-2 ${s.text} text-gray-700`}>
                    {showIcons && (
                      <PageIcons
                        name={icon}
                        directory="profileIcons"
                        size={20}
                        aria-hidden="true"
                      />
                    )}
                    {href ? (
                      <a
                        href={href}
                        className="underline underline-offset-4 hover:text-gray-900"
                      >
                        {isLoadingEmail && label === email ? "Laster e-post..." : label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>

        {showBio && profile.publicProfile?.biography && (
          <CardFooter className="p-0 mt-6">
            <p className={`${s.text} text-gray-900 max-w-2xl`}>
              {profile.publicProfile.biography}
            </p>
          </CardFooter>
        )}
      </div>
    </Card>
  );
}