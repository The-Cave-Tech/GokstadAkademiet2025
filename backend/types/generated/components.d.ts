import type { Schema, Struct } from '@strapi/strapi';

export interface FooterOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_footer_opening_hours';
  info: {
    description: '';
    displayName: 'openingHours';
  };
  attributes: {
    Fredag: Schema.Attribute.String;
    Lordag: Schema.Attribute.String;
    Mandag: Schema.Attribute.String;
    Onsdag: Schema.Attribute.String;
    Sondag: Schema.Attribute.String;
    Tirsdag: Schema.Attribute.String;
    Torsdag: Schema.Attribute.String;
  };
}

export interface FooterSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: '';
    displayName: 'socialLinks';
  };
  attributes: {
    icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    url: Schema.Attribute.String;
  };
}

export interface FooterSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_medias';
  info: {
    description: '';
    displayName: 'socialMedia';
  };
  attributes: {
    icon: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    url: Schema.Attribute.String;
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

export interface UserProfileAccountAdministration
  extends Struct.ComponentSchema {
  collectionName: 'components_user_profile_account_administrations';
  info: {
    displayName: 'Account Administration';
  };
  attributes: {
    accountActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    accountCreationDate: Schema.Attribute.DateTime;
    deletionReason: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 256;
      }>;
    lastLoginDate: Schema.Attribute.DateTime;
  };
}

export interface UserProfileNotificationSettings
  extends Struct.ComponentSchema {
  collectionName: 'components_user_profile_notification_settings';
  info: {
    displayName: 'Notification Settings';
  };
  attributes: {
    importantUpdates: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    newsletter: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface UserProfilePersonalInformation extends Struct.ComponentSchema {
  collectionName: 'components_user_profile_personal_informations';
  info: {
    description: '';
    displayName: 'Personal Information';
  };
  attributes: {
    birthDate: Schema.Attribute.Date;
    city: Schema.Attribute.String;
    fullName: Schema.Attribute.String & Schema.Attribute.Required;
    gender: Schema.Attribute.Enumeration<['Mann', 'Kvinne', 'Annet']>;
    phoneNumber: Schema.Attribute.String;
    postalCode: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 4;
        minLength: 4;
      }>;
    streetAddress: Schema.Attribute.String;
  };
}

export interface UserProfilePublicProfile extends Struct.ComponentSchema {
  collectionName: 'components_user_profile_public_profiles';
  info: {
    description: '';
    displayName: 'Public Profile';
  };
  attributes: {
    biography: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 256;
      }>;
    displayName: Schema.Attribute.String & Schema.Attribute.Required;
    profileimage: Schema.Attribute.Media<'images' | 'files'>;
    showAddress: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showEmail: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showPhone: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
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
      'footer.social-links': FooterSocialLinks;
      'footer.social-media': FooterSocialMedia;
      'landing-page.hero-section': LandingPageHeroSection;
      'user-profile.account-administration': UserProfileAccountAdministration;
      'user-profile.notification-settings': UserProfileNotificationSettings;
      'user-profile.personal-information': UserProfilePersonalInformation;
      'user-profile.public-profile': UserProfilePublicProfile;
      'user.profile': UserProfile;
    }
  }
}
