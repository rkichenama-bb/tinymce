import { FieldProcessor, FieldSchema } from '@ephox/boulder';

import * as ComponentSchema from '../../core/ComponentSchema';
import { BodyComponent, BodyComponentSpec } from './BodyComponent';

export interface GridSpec {
  type: 'grid';
  columns: number;
  items: BodyComponentSpec[];
}

export interface Grid {
  uid: string;
  type: 'grid';
  columns: number;
  items: BodyComponent[];
}

export const createGridFields = (itemsField: FieldProcessor): FieldProcessor[] => [
  ComponentSchema.uid,
  ComponentSchema.type,
  FieldSchema.requiredNumber('columns'),
  itemsField
];
