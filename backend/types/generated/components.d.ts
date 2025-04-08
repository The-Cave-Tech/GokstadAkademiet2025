import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksContentBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_blocks';
  info: {
    description: '';
    displayName: 'Content Block';
  };
  attributes: {
    Content: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface LayoutFullWidth extends Struct.ComponentSchema {
  collectionName: 'components_layout_full_widths';
  info: {
    description: '';
    displayName: 'full-width';
  };
  attributes: {
    content: Schema.Attribute.Text;
  };
}

export interface LayoutImageText extends Struct.ComponentSchema {
  collectionName: 'components_layout_image_texts';
  info: {
    displayName: 'image-text';
  };
  attributes: {
    mediaPosition: Schema.Attribute.Enumeration<['left,', 'right']>;
    text: Schema.Attribute.Blocks;
  };
}

export interface LayoutTwoColumns extends Struct.ComponentSchema {
  collectionName: 'components_layout_two_columns';
  info: {
    description: '';
    displayName: 'two-columns';
  };
  attributes: {
    leftColumnContent: Schema.Attribute.Blocks;
    leftColumnTitle: Schema.Attribute.String;
    rightColumnContent: Schema.Attribute.Blocks;
    rightColumnTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.content-block': BlocksContentBlock;
      'layout.full-width': LayoutFullWidth;
      'layout.image-text': LayoutImageText;
      'layout.two-columns': LayoutTwoColumns;
    }
  }
}
