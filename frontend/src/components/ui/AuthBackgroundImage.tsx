"use client";
import Image from "next/image";

export function AuthBackgroundImage({ className, priority = false }: AuthBackgroundImageProps) {
    return (
        <div className={className}>
          <Image
            src="/authbackground.jpg"
            alt="Bakgrunnsbilde"
            fill
            sizes="(max-width: 850px) 100vw, 50vw"
            className="object-cover"
            quality={75} // Eksplisitt satt til 75, kan justeres
            priority={priority} // Aktiveres for LCP-bilder
          />
        </div>
  );
}