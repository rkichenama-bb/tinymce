import { Optional } from '@ephox/katamari';

import * as ComponentSchema from '../../core/ComponentSchema';

export interface FormComponentSpec {
  type: string;
  name: string;
}

export interface FormComponent {
  uid: string;
  type: string;
  name: string;
}

export interface FormComponentWithLabelSpec extends FormComponentSpec {
  label?: string;
}

export interface FormComponentWithLabel extends FormComponent {
  label: Optional<string>;
}

export const formComponentFields = [
  ComponentSchema.uid,
  ComponentSchema.type,
  ComponentSchema.name
];

export const formComponentWithLabelFields = formComponentFields.concat([
  ComponentSchema.optionalLabel
]);
