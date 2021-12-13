/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Behaviour, Container as AlloyContainer, Focusing, SketchSpec, Tabstopping } from '@ephox/alloy';
import { Dialog } from '@ephox/bridge';

type HtmlPanelSpec = Omit<Dialog.HtmlPanel, 'type'>;

export const renderHtmlPanel = (spec: HtmlPanelSpec): SketchSpec => {
  if (spec.presets === 'presentation') {
    return AlloyContainer.sketch({
      uid: spec.uid,
      dom: {
        tag: 'div',
        classes: [ 'tox-form__group' ],
        innerHtml: spec.html
      }
    });
  } else {
    return AlloyContainer.sketch({
      uid: spec.uid,
      dom: {
        tag: 'div',
        classes: [ 'tox-form__group' ],
        innerHtml: spec.html,
        attributes: {
          role: 'document'
        }
      },
      containerBehaviours: Behaviour.derive([
        Tabstopping.config({ }),
        Focusing.config({ })
      ])
    });
  }
};
