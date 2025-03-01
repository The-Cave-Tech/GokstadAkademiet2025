"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; 

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/signin');
  };

  return (
    <main>
      <Button variant="danger" size="large" onClick={handleRedirect}>
        Logg inn
      </Button>
    </main>
  );
}





