"use client";
import Image from "next/image";
import { useState } from "react";
import { UserProfile, uploadProfileImage, deleteProfileImage, getProfileImageUrl } from '@/lib/data/services/publicProfileService';

interface ProfileImageUploaderProps {
  profile: UserProfile;
  onImageUpdate: (updatedProfile: UserProfile) => void;
}

export function ProfileImageUploader({ profile, onImageUpdate }: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const displayImage = getProfileImageUrl(profile);
  const isDefaultImage = !profile?.publicProfile?.profileimage;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const updatedProfile = await uploadProfileImage(file);
      onImageUpdate(updatedProfile);
    } catch (error) {
      console.error("Feil ved opplasting av profilbilde:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (isDefaultImage) return;
    
    try {
      setIsDeleting(true);
      const updatedProfile = await deleteProfileImage();
      onImageUpdate(updatedProfile);
    } catch (error) {
      console.error("Feil ved sletting av profilbilde:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="flex justify-center pb-2 font-medium text-gray-700 leading-6">
        Profilbilde
      </label>
      <figure>
        <Image
          src={displayImage}
          alt="Profilbilde"
          width={140}
          height={140}
          unoptimized
          className="rounded-full object-cover border border-gray-300 w-[140px] h-[140px]"
        />
      </figure>
      <figcaption className="flex gap-12 mt-4">
        {/* Slett-knapp – alltid plassert, men usynlig hvis default-bilde */}
        <button
          type="button"
          onClick={handleImageDelete}
          disabled={isDeleting || isDefaultImage}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-gray-700 ${
            isDefaultImage ? "invisible" : "hover:bg-gray-200"
          }`}
          aria-label="Slett profilbilde"
        >
          {isDeleting ? '⏳' : '🗑️'}
        </button>
                
        <label
          htmlFor="profileImage"
          className={`cursor-pointer w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-gray-700 ${
            isUploading ? 'opacity-50' : ''
          }`}
        >
          {isUploading ? '⏳' : '✏️'}
          <span className="sr-only">Endre profilbilde</span>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </label>
      </figcaption>
    </div>
  );
}