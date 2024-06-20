import { Arr, Cell, Obj, Type } from '@ephox/katamari';

import Editor from '../api/Editor';
import * as Events from '../api/Events';
import { EditorModeApi } from '../api/Mode';
import { toggleReadOnly } from './Readonly';

const defaultModes = [ 'design', 'readonly' ];

const switchToMode = (editor: Editor, activeMode: Cell<string>, availableModes: Record<string, EditorModeApi>, mode: string) => {
  const oldMode = availableModes[activeMode.get()];
  const newMode = availableModes[mode];
  const deactivate = Cell(true);

  // if deactivate fails, hope nothing bad happened and abort
  try {
    oldMode.deactivate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`problem while deactivating editor mode ${activeMode.get()}:`, e);
    deactivate.set(false);
    return;
  }
  if (deactivate.get()) {
    // if activate fails, hope nothing bad happened and abort
    try {
      newMode.activate();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`problem while activating editor mode ${mode}:`, e);
      return;
    }
    if (oldMode.editorReadOnly !== newMode.editorReadOnly) {
      if (Type.isObject(newMode.editorReadOnly)) {
        toggleReadOnly(editor, true);
      } else {
        toggleReadOnly(editor, newMode.editorReadOnly);
      }
    }
    activeMode.set(mode);
    Events.fireSwitchMode(editor, mode);
  }
};

const setMode = (editor: Editor, availableModes: Record<string, EditorModeApi>, activeMode: Cell<string>, mode: string): void => {
  if (mode === activeMode.get()) {
    return;
  } else if (!Obj.has(availableModes, mode)) {
    throw new Error(`Editor mode '${mode}' is invalid`);
  }

  if (editor.initialized) {
    switchToMode(editor, activeMode, availableModes, mode);
  } else {
    editor.on('init', () => switchToMode(editor, activeMode, availableModes, mode));
  }
};

const registerMode = (availableModes: Record<string, EditorModeApi>, mode: string, api: EditorModeApi): Record<string, EditorModeApi> => {
  if (Arr.contains(defaultModes, mode)) {
    throw new Error(`Cannot override default mode ${mode}`);
  }

  return {
    ...availableModes,
    [mode]: {
      ...api,
      deactivate: () => {
        // wrap custom deactivate APIs so they can't break the editor
        try {
          api.deactivate();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`problem while deactivating editor mode ${mode}:`, e);
        }
      }
    }
  };
};

export {
  setMode,
  registerMode
};
