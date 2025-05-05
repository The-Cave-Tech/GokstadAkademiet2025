"use client";
import Image from "next/image";
import { useState, useRef, useTransition } from "react";
import { getProfileImageUrl } from '@/lib/data/services/profileSections/publicProfileService';
import { UserProfile } from "@/lib/data/services/userProfile";
import PageIcons from "@/components/ui/custom/PageIcons";
import { ALLOWED_IMAGE_TYPES } from "@/lib/validation/profileSectionValidation";
import { 
  uploadProfileImageAction, 
  deleteProfileImageAction 
} from "@/lib/data/actions/profileSections/profileImage";
import { initialProfileImageState } from "@/types/profileImages.types";

interface ProfileImageUploaderProps {
  profile: UserProfile;
  onImageUpdate: (updatedProfile: UserProfile) => void;
}

export function ProfileImageUploader({ profile, onImageUpdate }: ProfileImageUploaderProps) {
  // Form reference for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use useTransition for server actions
  const [isPending, startTransition] = useTransition();
  
  // UI and error states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Profile data
  const displayImage = getProfileImageUrl(profile);
  const isDefaultImage = !profile?.publicProfile?.profileimage;

  // Handle file selection - bruk kun server-validering
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset previous error
    setServerError(null);
    
    // Create FormData and submit to server action
    const formData = new FormData();
    formData.append('profileImage', file);
    
    setIsUploading(true);
    
    // Use startTransition to wrap the server action
    startTransition(async () => {
      try {
        // Server action handles all validation and file processing
        const result = await uploadProfileImageAction(initialProfileImageState, formData);
        
        if (result.success && result.updatedProfile) {
          onImageUpdate(result.updatedProfile);
        } else if (result.error) {
          setServerError(result.error);
        }
      } catch (error) {
        setServerError(error instanceof Error ? error.message : "Det oppstod en feil");
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  // Handle image deletion
  const handleImageDelete = () => {
    if (isDefaultImage) return;
    
    setIsDeleting(true);
    setServerError(null);
    
    // Use startTransition to wrap the server action
    startTransition(async () => {
      try {
        // Server action handles deletion and error handling
        const result = await deleteProfileImageAction();
        
        if (result.success && result.updatedProfile) {
          onImageUpdate(result.updatedProfile);
        } else if (result.error) {
          setServerError(result.error);
        }
      } catch (error) {
        setServerError(error instanceof Error ? error.message : "Det oppstod en feil");
      } finally {
        setIsDeleting(false);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <label className="flex justify-center pb-2 font-medium text-gray-700 leading-6">
        Profilbilde
      </label>
      {/* Profile image */}
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
      
      {/* File type info */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Tillatte formater: {ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')}
      </div>
      {serverError && (
        <div className=" border-red-200 text-red-700 rounded-md flex items-start w-full">
          <span>{serverError}</span>
        </div>
      )}
      
      {/* Action buttons */}
      <figcaption className="flex gap-12 mt-4">
        {/* Delete button */}
        <button
          type="button"
          onClick={handleImageDelete}
          disabled={isDeleting || isDefaultImage || isPending}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-gray-700 ${
            isDefaultImage ? "invisible" : "hover:bg-gray-200"
          }`}
          aria-label="Slett profilbilde"
        >
          {isDeleting ? (
            <PageIcons name="loading" directory="profileIcons" size={24} alt="Laster..." className="animate-spin" />
          ) : (
            <PageIcons name="delete" directory="profileIcons" size={24} alt="Slett" />
          )}
        </button>
                
        {/* Upload button */}
        <label
          htmlFor="profileImage"
          className={`cursor-pointer w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-gray-700 ${
            (isUploading || isPending) ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          {isUploading ? (
            <PageIcons name="loading" directory="profileIcons" size={24} alt="Laster..." className="animate-spin" />
          ) : (
            <PageIcons name="edit" directory="profileIcons" size={24} alt="Endre" />
          )}
          <span className="sr-only">Endre profilbilde</span>
          <input
            ref={fileInputRef}
            id="profileImage"
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading || isPending}
          />
        </label>
      </figcaption>
    </div>
  );
}