'use client';

import { useRouter } from 'next/navigation';
import PageIcons from './ui/custom/PageIcons';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center font-medium text-sm uppercase hover:underline "
      aria-label="Gå tilbake til forrige side"
    >
      <figure className="mr-1">
        <PageIcons name="back" directory="pageIcons" size={24} isDecorative={true}/>
      </figure>
      Tilbake
    </button>
  );
}