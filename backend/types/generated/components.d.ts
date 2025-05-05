import type { Schema, Struct } from '@strapi/strapi';

export interface FooterOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_footer_opening_hours';
  info: {
    description: '';
    displayName: 'openingHours';
  };
  attributes: {
    Fredag: Schema.Attribute.String;
    Mandag: Schema.Attribute.String;
    Onsdag: Schema.Attribute.String;
    Tirsdag: Schema.Attribute.String;
    Torsdag: Schema.Attribute.String;
  };
}

export interface LandingPageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_landing_page_hero_sections';
  info: {
    description: '';
    displayName: 'HeroSection';
  };
  attributes: {
    landingImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface UserProfile extends Struct.ComponentSchema {
  collectionName: 'components_user_profiles';
  info: {
    displayName: 'Profile';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.opening-hours': FooterOpeningHours;
      'landing-page.hero-section': LandingPageHeroSection;
      'user.profile': UserProfile;
    }
  }
}
