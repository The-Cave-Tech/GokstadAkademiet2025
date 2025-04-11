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
