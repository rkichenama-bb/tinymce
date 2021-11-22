/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Arr, Obj, Strings, Type } from '@ephox/katamari';
import { PlatformDetection } from '@ephox/sand';

import DOMUtils from './dom/DOMUtils';
import Editor from './Editor';
import { EditorOptions } from './OptionTypes';
import I18n from './util/I18n';
import Tools from './util/Tools';

const deviceDetection = PlatformDetection.detect().deviceType;
const isTouch = deviceDetection.isTouch();
const DOM = DOMUtils.DOM;

const getHash = (value: string): Record<string, string> => {
  const items = value.indexOf('=') > 0 ? value.split(/[;,](?![^=;,]*(?:[;,]|$))/) : value.split(',');
  return Arr.foldl(items, (output, item) => {
    const arr = item.split('=');
    const key = arr[0];
    const val = arr.length > 1 ? arr[1] : key;
    output[Strings.trim(key)] = Strings.trim(val);
    return output;
  }, {} as Record<string, string>);
};

const option = <K extends keyof EditorOptions>(name: K) => (editor: Editor) =>
  editor.options.get(name);

const stringOrObjectProcessor = (value: string) =>
  Type.isString(value) || Type.isObject(value);

const bodyOptionProcessor = (editor: Editor, defaultValue: string = '') => (value: unknown) => {
  const valid = Type.isString(value);
  if (valid) {
    if (value.indexOf('=') !== -1) {
      const bodyObj = getHash(value);
      return { value: Obj.get(bodyObj, editor.id).getOr(defaultValue), valid };
    } else {
      return { value, valid };
    }
  } else {
    return { valid: false as const, message: 'Must be a string.' };
  }
};

const register = (editor: Editor) => {
  const registerOption = editor.options.register;

  registerOption('id', {
    processor: 'string',
    default: editor.id
  });

  registerOption('selector', {
    processor: 'string'
  });

  registerOption('target', {
    processor: 'object'
  });

  registerOption('suffix', {
    processor: 'string'
  });

  registerOption('cache_suffix', {
    processor: 'string'
  });

  registerOption('base_url', {
    processor: 'string'
  });

  registerOption('referrer_policy', {
    processor: 'string',
    default: ''
  });

  registerOption('language_load', {
    processor: 'boolean'
  });

  registerOption('inline', {
    processor: 'boolean',
    default: false
  });

  registerOption('iframe_attrs', {
    processor: 'object',
    default: {}
  });

  registerOption('doctype', {
    processor: 'string',
    default: '<!DOCTYPE html>'
  });

  registerOption('document_base_url', {
    processor: 'string',
    default: editor.documentBaseUrl
  });

  registerOption('body_id', {
    processor: bodyOptionProcessor(editor, 'tinymce'),
    default: 'tinymce'
  });

  registerOption('body_class', {
    processor: bodyOptionProcessor(editor),
    default: ''
  });

  registerOption('content_security_policy', {
    processor: 'string',
    default: ''
  });

  registerOption('br_in_pre', {
    processor: 'boolean',
    default: true
  });

  registerOption('forced_root_block', {
    processor: (value) => {
      const valid = Type.isString(value) || Type.isBoolean(value);
      if (valid) {
        if (value === false) {
          return { value: '', valid };
        } else if (value === true) {
          return { value: 'p', valid };
        } else {
          return { value, valid };
        }
      } else {
        return { valid: false, message: 'Must be a string or a boolean.' };
      }
    },
    default: 'p'
  });

  registerOption('forced_root_block_attrs', {
    processor: 'object',
    default: {}
  });

  registerOption('br_newline_selector', {
    processor: 'string',
    default: '.mce-toc h2,figcaption,caption'
  });

  registerOption('no_newline_selector', {
    processor: 'string',
    default: ''
  });

  registerOption('keep_styles', {
    processor: 'boolean',
    default: true
  });

  registerOption('end_container_on_empty_block', {
    processor: 'boolean',
    default: false
  });

  registerOption('font_size_style_values', {
    processor: 'string',
    default: 'xx-small,x-small,small,medium,large,x-large,xx-large'
  });

  registerOption('font_size_legacy_values', {
    processor: 'string',
    // See: http://www.w3.org/TR/CSS2/fonts.html#propdef-font-size
    default: 'xx-small,small,medium,large,x-large,xx-large,300%'
  });

  registerOption('font_size_classes', {
    processor: 'string',
    default: ''
  });

  registerOption('automatic_uploads', {
    processor: 'boolean',
    default: true
  });

  registerOption('images_reuse_filename', {
    processor: 'boolean',
    default: false
  });

  registerOption('images_replace_blob_uris', {
    processor: 'boolean',
    default: true
  });

  registerOption('icons', {
    processor: 'string',
    default: ''
  });

  registerOption('icons_url', {
    processor: 'string',
    default: ''
  });

  registerOption('images_upload_url', {
    processor: 'string',
    default: ''
  });

  registerOption('images_upload_base_path', {
    processor: 'string',
    default: ''
  });

  registerOption('images_upload_base_path', {
    processor: 'string',
    default: ''
  });

  registerOption('images_upload_credentials', {
    processor: 'boolean',
    default: false
  });

  registerOption('images_upload_handler', {
    processor: 'function'
  });

  registerOption('language', {
    processor: 'string',
    default: 'en'
  });

  registerOption('language_url', {
    processor: 'string',
    default: ''
  });

  registerOption('entity_encoding', {
    processor: 'string',
    default: 'named'
  });

  registerOption('indent', {
    processor: 'boolean',
    default: true
  });

  registerOption('indent_before', {
    processor: 'string',
    default: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' +
      'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist'
  });

  registerOption('indent_after', {
    processor: 'string',
    default: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' +
      'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist'
  });

  registerOption('indent_use_margin', {
    processor: 'boolean',
    default: false
  });

  registerOption('indentation', {
    processor: 'string',
    default: '40px'
  });

  registerOption('content_css', {
    processor: (value) => {
      const valid = value === false || Type.isString(value) || Type.isArrayOf(value, Type.isString);

      if (valid) {
        if (Type.isString(value)) {
          return { value: Arr.map(value.split(','), Strings.trim), valid };
        } else if (Type.isArray(value)) {
          return { value, valid };
        } else if (value === false || editor.inline) {
          return { value: [], valid };
        } else {
          return { value, valid };
        }
      } else {
        return { valid: false, message: 'Must be false, a string or an array of strings.' };
      }
    },
    default: [ 'default' ]
  });

  registerOption('content_style', {
    processor: 'string'
  });

  registerOption('content_css_cors', {
    processor: 'boolean',
    default: false
  });

  registerOption('font_css', {
    processor: (value) => {
      const valid = Type.isString(value) || Type.isArrayOf(value, Type.isString);

      if (valid) {
        const newValue = Type.isArray(value) ? value : Arr.map(value.split(','), Strings.trim);
        return { value: newValue, valid };
      } else {
        return { valid: false, message: 'Must be a string or an array of strings.' };
      }
    },
    default: []
  });

  registerOption('inline_boundaries', {
    processor: 'boolean',
    default: true
  });

  registerOption('inline_boundaries_selector', {
    processor: 'string',
    default: 'a[href],code,.mce-annotation'
  });

  registerOption('object_resizing', {
    processor: (value) => {
      const valid = Type.isBoolean(value) || Type.isString(value);
      if (valid) {
        if (value === false || deviceDetection.isiPhone() || deviceDetection.isiPad()) {
          return { value: '', valid };
        } else {
          return { value: value === true ? 'table,img,figure.image,div,video,iframe' : value, valid };
        }
      } else {
        return { valid: false, message: 'Must be boolean or a string' };
      }
    },
    // No nice way to do object resizing on touch devices at this stage
    default: !isTouch
  });

  registerOption('resize_img_proportional', {
    processor: 'boolean',
    default: true
  });

  registerOption('event_root', {
    processor: 'object'
  });

  registerOption('service_message', {
    processor: 'string'
  });

  registerOption('theme', {
    processor: (value) => value === false || Type.isString(value) || Type.isFunction(value),
    default: 'silver'
  });

  registerOption('theme_url', {
    processor: 'string'
  });

  registerOption('formats', {
    processor: 'object'
  });

  registerOption('format_empty_lines', {
    processor: 'boolean',
    default: false
  });

  registerOption('preview_styles', {
    processor: (value) => {
      const valid = value === false || Type.isString(value);
      if (valid) {
        return { value: value === false ? '' : value, valid };
      } else {
        return { valid: false, message: 'Must be false or a string' };
      }
    },
    default: 'font-family font-size font-weight font-style text-decoration text-transform color background-color border border-radius outline text-shadow'
  });

  registerOption('custom_ui_selector', {
    processor: 'string',
    default: ''
  });

  registerOption('hidden_input', {
    processor: 'boolean',
    default: true
  });

  registerOption('submit_patch', {
    processor: 'boolean',
    default: true
  });

  registerOption('encoding', {
    processor: 'string'
  });

  registerOption('add_form_submit_trigger', {
    processor: 'boolean',
    default: true
  });

  registerOption('add_unload_trigger', {
    processor: 'boolean',
    default: true
  });

  registerOption('custom_undo_redo_levels', {
    processor: 'number',
    default: 0
  });

  registerOption('disable_nodechange', {
    processor: 'boolean',
    default: false
  });

  registerOption('readonly', {
    processor: 'boolean',
    default: false
  });

  registerOption('plugins', {
    processor: 'string',
    default: ''
  });

  registerOption('external_plugins', {
    processor: 'object'
  });

  registerOption('forced_plugins', {
    processor: 'string[]'
  });

  registerOption('block_unsupported_drop', {
    processor: 'boolean',
    default: true
  });

  registerOption('visual', {
    processor: 'boolean',
    default: true
  });

  registerOption('visual_table_class', {
    processor: 'string',
    default: 'mce-item-table'
  });

  registerOption('visual_anchor_class', {
    processor: 'string',
    default: 'mce-item-anchor'
  });

  registerOption('iframe_aria_text', {
    processor: 'string',
    default: 'Rich Text Area. Press ALT-0 for help.'
  });

  registerOption('setup', {
    processor: 'function'
  });

  registerOption('init_instance_callback', {
    processor: 'function'
  });

  registerOption('url_converter', {
    processor: 'function',
    // Note: Don't bind here, as the binding is handled via the `url_converter_scope`
    // eslint-disable-next-line @typescript-eslint/unbound-method
    default: editor.convertURL
  });

  registerOption('url_converter_scope', {
    processor: 'object',
    default: editor
  });

  registerOption('urlconverter_callback', {
    processor: 'function'
  });

  registerOption('allow_conditional_comments', {
    processor: 'boolean',
    default: false
  });

  registerOption('allow_html_data_urls', {
    processor: 'boolean',
    default: false
  });

  registerOption('allow_svg_data_urls', {
    processor: 'boolean'
  });

  registerOption('allow_html_in_named_anchor', {
    processor: 'boolean',
    default: false
  });

  registerOption('allow_script_urls', {
    processor: 'boolean',
    default: false
  });

  registerOption('allow_unsafe_link_target', {
    processor: 'boolean',
    default: false
  });

  registerOption('convert_fonts_to_spans', {
    processor: 'boolean',
    default: true
  });

  registerOption('fix_list_elements', {
    processor: 'boolean',
    default: false
  });

  registerOption('padd_empty_with_br', {
    processor: 'boolean',
    default: false
  });

  registerOption('preserve_cdata', {
    processor: 'boolean',
    default: false
  });

  registerOption('remove_trailing_brs', {
    processor: 'boolean'
  });

  registerOption('inline_styles', {
    processor: 'boolean',
    default: true
  });

  registerOption('element_format', {
    processor: 'string'
  });

  registerOption('entities', {
    processor: 'string'
  });

  registerOption('schema', {
    processor: 'string'
  });

  registerOption('convert_urls', {
    processor: 'boolean',
    default: true
  });

  registerOption('relative_urls', {
    processor: 'boolean',
    default: true
  });

  registerOption('remove_script_host', {
    processor: 'boolean',
    default: true
  });

  registerOption('custom_elements', {
    processor: 'string'
  });

  registerOption('extended_valid_elements', {
    processor: 'string'
  });

  registerOption('invalid_elements', {
    processor: 'string'
  });

  registerOption('invalid_styles', {
    processor: stringOrObjectProcessor
  });

  registerOption('valid_children', {
    processor: 'string'
  });

  registerOption('valid_classes', {
    processor: stringOrObjectProcessor
  });

  registerOption('valid_elements', {
    processor: 'string'
  });

  registerOption('valid_styles', {
    processor: stringOrObjectProcessor
  });

  registerOption('verify_html', {
    processor: 'boolean',
    default: true
  });

  registerOption('auto_focus', {
    processor: (value) => Type.isString(value) || value === true
  });

  registerOption('browser_spellcheck', {
    processor: 'boolean',
    default: false
  });

  registerOption('protect', {
    processor: 'array'
  });

  registerOption('images_file_types', {
    processor: 'string',
    default: 'jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp'
  });

  registerOption('deprecation_warnings', {
    processor: 'boolean',
    default: true
  });

  registerOption('a11y_advanced_options', {
    processor: 'boolean',
    default: false
  });

  registerOption('content_editable_state', {
    processor: 'boolean',
    default: true
  });

  // These options must be registered later in the init sequence due to their default values
  // TODO: TINY-8234 Should we have a way to lazily load the default values?
  editor.on('ScriptsLoaded', () => {
    registerOption('directionality', {
      processor: 'string',
      default: I18n.isRtl() ? 'rtl' : undefined
    });

    registerOption('placeholder', {
      processor: 'string',
      // Fallback to the original elements placeholder if not set in the settings
      default: DOM.getAttrib(editor.getElement(), 'placeholder')
    });
  });
};

const getIframeAttrs = option('iframe_attrs');
const getDocType = option('doctype');
const getDocumentBaseUrl = option('document_base_url');
const getBodyId = option('body_id');
const getBodyClass = option('body_class');
const getContentSecurityPolicy = option('content_security_policy');
const shouldPutBrInPre = option('br_in_pre');
const getForcedRootBlock = option('forced_root_block');
const getForcedRootBlockAttrs = option('forced_root_block_attrs');
const getBrNewLineSelector = option('br_newline_selector');
const getNoNewLineSelector = option('no_newline_selector');
const shouldKeepStyles = option('keep_styles');
const shouldEndContainerOnEmptyBlock = option('end_container_on_empty_block');
const isAutomaticUploadsEnabled = option('automatic_uploads');
const shouldReuseFileName = option('images_reuse_filename');
const shouldReplaceBlobUris = option('images_replace_blob_uris');
const getIconPackName = option('icons');
const getIconsUrl = option('icons_url');
const getImageUploadUrl = option('images_upload_url');
const getImageUploadBasePath = option('images_upload_base_path');
const getImagesUploadCredentials = option('images_upload_credentials');
const getImagesUploadHandler = option('images_upload_handler');
const shouldUseContentCssCors = option('content_css_cors');
const getReferrerPolicy = option('referrer_policy');
const getLanguageCode = option('language');
const getLanguageUrl = option('language_url');
const shouldIndentUseMargin = option('indent_use_margin');
const getIndentation = option('indentation');
const getContentCss = option('content_css');
const getContentStyle = option('content_style');
const getFontCss = option('font_css');
const getDirectionality = option('directionality');
const getInlineBoundarySelector = option('inline_boundaries_selector');
const getObjectResizing = option('object_resizing');
const getResizeImgProportional = option('resize_img_proportional');
const getPlaceholder = option('placeholder');
const getEventRoot = option('event_root');
const getServiceMessage = option('service_message');
const getTheme = option('theme');
const getThemeUrl = option('theme_url');
const isInlineBoundariesEnabled = option('inline_boundaries');
const getFormats = option('formats');
const getPreviewStyles = option('preview_styles');
const canFormatEmptyLines = option('format_empty_lines');
const getCustomUiSelector = option('custom_ui_selector');
const isInline = option('inline');
const hasHiddenInput = option('hidden_input');
const shouldPatchSubmit = option('submit_patch');
const shouldAddFormSubmitTrigger = option('add_form_submit_trigger');
const shouldAddUnloadTrigger = option('add_unload_trigger');
const getCustomUndoRedoLevels = option('custom_undo_redo_levels');
const shouldDisableNodeChange = option('disable_nodechange');
const isReadOnly = option('readonly');
const hasContentCssCors = option('content_css_cors');
const getPlugins = option('plugins');
const getExternalPlugins = option('external_plugins');
const shouldBlockUnsupportedDrop = option('block_unsupported_drop');
const isVisualAidsEnabled = option('visual');
const getVisualAidsTableClass = option('visual_table_class');
const getVisualAidsAnchorClass = option('visual_anchor_class');
const getIframeAriaText = option('iframe_aria_text');
const getSetupCallback = option('setup');
const getInitInstanceCallback = option('init_instance_callback');
const getUrlConverterCallback = option('urlconverter_callback');
const getAutoFocus = option('auto_focus');
const shouldBrowserSpellcheck = option('browser_spellcheck');
const getProtect = option('protect');
const getContentEditableState = option('content_editable_state');

const getFontStyleValues = (editor: Editor): string[] =>
  Tools.explode(editor.options.get('font_size_style_values'));

const getFontSizeClasses = (editor: Editor): string[] =>
  Tools.explode(editor.options.get('font_size_classes'));

const isEncodingXml = (editor: Editor): boolean =>
  editor.options.get('encoding') === 'xml';

const hasForcedRootBlock = (editor: Editor): boolean =>
  getForcedRootBlock(editor) !== '';

export {
  register,

  getIframeAttrs,
  getDocType,
  getDocumentBaseUrl,
  getBodyId,
  getBodyClass,
  getContentSecurityPolicy,
  shouldPutBrInPre,
  getForcedRootBlock,
  getForcedRootBlockAttrs,
  getBrNewLineSelector,
  getNoNewLineSelector,
  shouldKeepStyles,
  shouldEndContainerOnEmptyBlock,
  getFontStyleValues,
  getFontSizeClasses,
  getIconPackName,
  getIconsUrl,
  isAutomaticUploadsEnabled,
  shouldReuseFileName,
  shouldReplaceBlobUris,
  getImageUploadUrl,
  getImageUploadBasePath,
  getImagesUploadCredentials,
  getImagesUploadHandler,
  shouldUseContentCssCors,
  getReferrerPolicy,
  getLanguageCode,
  getLanguageUrl,
  shouldIndentUseMargin,
  getIndentation,
  getContentCss,
  getContentStyle,
  getDirectionality,
  getInlineBoundarySelector,
  getObjectResizing,
  getResizeImgProportional,
  getPlaceholder,
  getEventRoot,
  getServiceMessage,
  getTheme,
  isInlineBoundariesEnabled,
  getFormats,
  getPreviewStyles,
  canFormatEmptyLines,
  getCustomUiSelector,
  getThemeUrl,
  isInline,
  hasHiddenInput,
  shouldPatchSubmit,
  isEncodingXml,
  shouldAddFormSubmitTrigger,
  shouldAddUnloadTrigger,
  hasForcedRootBlock,
  getCustomUndoRedoLevels,
  shouldDisableNodeChange,
  isReadOnly,
  hasContentCssCors,
  getPlugins,
  getExternalPlugins,
  shouldBlockUnsupportedDrop,
  isVisualAidsEnabled,
  getVisualAidsTableClass,
  getFontCss,
  getVisualAidsAnchorClass,
  getSetupCallback,
  getInitInstanceCallback,
  getUrlConverterCallback,
  getIframeAriaText,
  getAutoFocus,
  shouldBrowserSpellcheck,
  getProtect,
  getContentEditableState
};