import type { Schema, Struct } from '@strapi/strapi';

export interface LandingPageHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_landing_page_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    landingImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    Subtitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface UserInformationUserInformation extends Struct.ComponentSchema {
  collectionName: 'components_user_information_user_informations';
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
    }
  }
}
