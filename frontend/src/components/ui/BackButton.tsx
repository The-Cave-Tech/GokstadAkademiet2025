'use client';

import { useRouter } from 'next/navigation';
import PageIcons from './custom/PageIcons';
import { ReactNode } from 'react';

interface BackButtonProps {
  route?: string;
  label?: string | ReactNode;
  iconSize?: number;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
  iconName?: string;
  iconDirectory?: string;
  children?: ReactNode;
}

export default function BackButton({ 
  route, 
  label = 'Tilbake', 
  iconSize = 24,
  className = "flex items-center font-medium text-sm uppercase hover:underline",
  iconClassName = "mr-1",
  showIcon = true,
  iconName = "back",
  iconDirectory = "pageIcons",
  children
}: BackButtonProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigation}
      className={className}
      aria-label={`Gå ${route ? 'til' : 'tilbake til forrige side'}`}
    >
      {showIcon && (
        <figure className={iconClassName}>
          <PageIcons 
            name={iconName} 
            directory={iconDirectory} 
            size={iconSize} 
            isDecorative={true} 
          />
        </figure>
      )}
      {children || label}
    </button>
  );
}


/* how to use */
/* // Standard tilbakeknapp
<BackButton />

// Med spesifikk rute
<BackButton route="/dashboard" />

// Tilpasset design
<BackButton 
  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center" 
  iconClassName="mr-2"
/>

// Uten ikon
<BackButton showIcon={false} />

// Med annet ikon
<BackButton iconName="arrow-left" iconDirectory="navIcons" />

// Med kompleks innhold (ReactNode) i stedet for enkel tekst
<BackButton>
  <span className="font-bold">Tilbake</span> til forsiden
</BackButton>

// Komplett tilpasset
<BackButton 
  route="/hjem"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl shadow-lg" 
  iconClassName="mr-3"
  iconSize={20}
  iconName="home"
>
  <span className="font-semibold">Gå til hjemmesiden</span>
</BackButton>

*/