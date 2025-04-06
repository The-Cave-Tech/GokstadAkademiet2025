import { getHero } from "@/lib/data/services/getHero";
import Image from "next/image";

export default async function LandingPageHero() {
  const hero = await getHero();

  return (
    <section className="relative text-center py-20 px-4 bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.landingImage.url}
          alt="Landing Image"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{hero.title}</h1>
        <p className="text-lg md:text-2xl">{hero.subtitle}</p>
      </div>
    </section>
  );
}
