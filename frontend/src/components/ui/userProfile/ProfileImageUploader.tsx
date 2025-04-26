"use client";

import Image from "next/image";

interface ProfileImageUploaderProps {
  imageUrl: string;
  isEditing: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
}

export function ProfileImageUploader({
  imageUrl,
  isEditing,
  onImageChange,
  onImageDelete,
}: ProfileImageUploaderProps) {

  const displayImage = imageUrl;

  const isDefaultImage = imageUrl === "/images/default-profile.png";

  return (
    <div className="flex flex-col items-center">
      <label className="flex justify-center pb-2 font-medium text-gray-700 leading-6">
        Profilbilde
      </label>
      <figure>
        <Image
          src={displayImage}
          alt="Profilbilde"
          width={70}
          height={64}
          unoptimized
          className="rounded-full object-cover border border-gray-300 w-[140] h-[140]"
        />
      </figure>
      {isEditing && (
        <figcaption className="flex gap-12 mt-4">
          {/* Slett-knapp – alltid plassert, men usynlig hvis default-bilde */}
          <button
            type="button"
            onClick={onImageDelete}
            className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-white ${
              isDefaultImage ? "invisible" : "hover:bg-blue-600"
            }`}
            aria-label="Slett profilbilde"
          >
            <span className="text-xl">🗑️</span>
          </button>

          
          <label
            htmlFor="profileImage"
            className="cursor-pointer w-10 h-10 hover:bg-blue-600 rounded-full flex items-center justify-center border border-gray-300 shadow-sm text-white"
          >
            <span className="text-xl">✏️</span>
            <span className="sr-only">Endre profilbilde</span>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </label>
        </figcaption>
      )}
    </div>
  );
}
