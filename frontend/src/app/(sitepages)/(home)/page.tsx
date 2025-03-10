"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/Footer"; 
import KontaktOss from "@/app/(sitepages)/contactus/contactus"

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/signin");
  };

  return (
    <main className="flex flex-col min-h-screen justify-between">
      <div className="flex-grow flex justify-center items-center">
        <Button onClick={handleRedirect}>Logg inn</Button>
      </div>
      <KontaktOss />
      <Footer />
    </main>
  );
}
