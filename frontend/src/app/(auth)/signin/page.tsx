"use client";
import { SignInForm } from "@/components/SignInForm";
import { AuthBackgroundImage } from "@/components/ui/AuthBackgroundImage";

export default function SignInRoute() {
  return (
    <section className="relative flex flex-col custom-lg:flex-row items-center justify-center w-full h-full">
      <AuthBackgroundImage
        className="absolute inset-0 w-full h-full custom-lg:hidden"
        priority={true} // LCP på små skjermer
      />
      <div className="relative z-10 w-full custom-lg:w-1/2 flex items-center justify-center p-4 custom-lg:p-0">
        <SignInForm />
      </div>
      <AuthBackgroundImage
        className="hidden custom-lg:block custom-lg:w-1/2 relative h-[500px] custom-lg:h-full"
        priority={false} // Ikke LCP på store skjermer
      />
    </section>
  );
}

