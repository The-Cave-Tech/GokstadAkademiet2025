"use client"

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/dashboard";
import { fetchUserProfile } from "@/lib/services/strapiProfileData";

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Call function to fetch user profile
        const fetchData = async () => {
            const profileData = await fetchUserProfile();
            setProfile(profileData);
        }

        fetchData();
    }, []);

    if(!profile) return <p>Loading.....</p>

    return (
        <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="relative">
                {/* Background Image */}
                {profile.backgroundImage && (
                    <div 
                        className="absolute top-0 left-0 right-0 h-64 bg-cover bg-center opacity-50"
                        style={{backgroundImage: `url(${profile.backgroundImage})`}}
                    />
                )}
            </div>
            <div>
                <h1>{profile.profileName}</h1>
                <p>{profile.bio}</p>
            </div>  
        </section>
    )
}