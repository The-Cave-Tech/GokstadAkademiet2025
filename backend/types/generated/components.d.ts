import type { Schema, Struct } from '@strapi/strapi';

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
      'user.profile': UserProfile;
    }
  }
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
    displayName: 'User Information';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'landing-page.hero-section': LandingPageHeroSection;
      'user-information.user-information': UserInformationUserInformation;
      'user.profile': UserProfile;
    }
  }
}