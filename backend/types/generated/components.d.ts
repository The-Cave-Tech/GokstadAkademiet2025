import type { Schema, Struct } from '@strapi/strapi';

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
      'user-information.user-information': UserInformationUserInformation;
    }
  }
}
