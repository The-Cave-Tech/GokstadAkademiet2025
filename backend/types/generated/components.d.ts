import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksContentBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_blocks';
  info: {
    displayName: 'Content Block';
  };
  attributes: {
    Content: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface LayoutFullWidth extends Struct.ComponentSchema {
  collectionName: 'components_layout_full_widths';
  info: {
    displayName: 'Full Width';
  };
  attributes: {
    Content: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface LayoutTwoColumns extends Struct.ComponentSchema {
  collectionName: 'components_layout_two_columns';
  info: {
    description: '';
    displayName: 'Two columns';
  };
  attributes: {
    leftColumn: Schema.Attribute.Component<'blocks.content-block', false>;
    rightColumn: Schema.Attribute.Component<'blocks.content-block', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.content-block': BlocksContentBlock;
      'layout.full-width': LayoutFullWidth;
      'layout.two-columns': LayoutTwoColumns;
    }
  }
}
