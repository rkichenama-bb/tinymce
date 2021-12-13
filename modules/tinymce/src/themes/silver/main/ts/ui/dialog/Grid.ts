/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Behaviour, Replacing, SimpleSpec } from '@ephox/alloy';
import { Dialog } from '@ephox/bridge';
import { Arr } from '@ephox/katamari';

import { UiFactoryBackstageShared } from '../../backstage/Backstage';

type GridSpec = Omit<Dialog.Grid, 'type'>;

export const renderGrid = (spec: GridSpec, backstage: UiFactoryBackstageShared): SimpleSpec => ({
  uid: spec.uid,
  dom: {
    tag: 'div',
    classes: [ 'tox-form__grid', `tox-form__grid--${spec.columns}col` ]
  },
  components: Arr.map(spec.items, backstage.interpreter),
  behaviours: Behaviour.derive([
    Replacing.config({})
  ])
});
