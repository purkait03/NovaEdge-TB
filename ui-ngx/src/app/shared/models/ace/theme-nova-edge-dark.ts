/**
 * Nova Edge Dark Brown ACE Theme
 * Matches the global warm coffee palette:
 *  bg #15100B, gutter #120D09, line #8F7963, text #E8D8C4,
 *  keyword #E87918, string #E8C9A0, function #F5E7D0, comment #7A6452,
 *  selection #4A3323, active-line #1F150E, cursor #E87918, border #4A3020
 */

export const NOVA_EDGE_DARK_CSS = `
.ace-nova-edge-dark .ace_gutter {
  background: #120D09;
  color: #8F7963;
  border-right: 1px solid #4A3020;
}
.ace-nova-edge-dark .ace_print-margin {
  width: 1px;
  background: #4A3020;
}
.ace-nova-edge-dark {
  background-color: #15100B;
  color: #E8D8C4;
}
.ace-nova-edge-dark .ace_cursor {
  color: #E87918;
}
.ace-nova-edge-dark .ace_marker-layer .ace_selection {
  background: #4A3323;
}
.ace-nova-edge-dark.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #15100B;
}
.ace-nova-edge-dark .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0);
}
.ace-nova-edge-dark .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #4A3020;
}
.ace-nova-edge-dark .ace_marker-layer .ace_active-line {
  background: #1F150E;
}
.ace-nova-edge-dark .ace_gutter-active-line {
  background-color: #1F150E;
}
.ace-nova-edge-dark .ace_marker-layer .ace_selected-word {
  border: 1px solid #4A3323;
}
.ace-nova-edge-dark .ace_invisible {
  color: #3D2A1D;
}
.ace-nova-edge-dark .ace_entity.ace_name.ace_tag,
.ace-nova-edge-dark .ace_keyword,
.ace-nova-edge-dark .ace_meta.ace_tag,
.ace-nova-edge-dark .ace_storage {
  color: #E87918;
}
.ace-nova-edge-dark .ace_keyword.ace_operator {
  color: #F28A24;
}
.ace-nova-edge-dark .ace_punctuation,
.ace-nova-edge-dark .ace_punctuation.ace_tag {
  color: #E8D8C4;
}
.ace-nova-edge-dark .ace_constant.ace_character,
.ace-nova-edge-dark .ace_constant.ace_language,
.ace-nova-edge-dark .ace_constant.ace_numeric,
.ace-nova-edge-dark .ace_constant.ace_other {
  color: #C49A6C;
}
.ace-nova-edge-dark .ace_invalid {
  color: #F8F8F0;
  background-color: #6D2C1F;
}
.ace-nova-edge-dark .ace_invalid.ace_deprecated {
  color: #F8F8F0;
  background-color: #8D6B46;
}
.ace-nova-edge-dark .ace_support.ace_constant,
.ace-nova-edge-dark .ace_support.ace_function {
  color: #F5E7D0;
}
.ace-nova-edge-dark .ace_fold {
  background-color: #E87918;
  border-color: #E8D8C4;
}
.ace-nova-edge-dark .ace_storage.ace_type,
.ace-nova-edge-dark .ace_support.ace_class,
.ace-nova-edge-dark .ace_support.ace_type {
  font-style: italic;
  color: #E8C9A0;
}
.ace-nova-edge-dark .ace_entity.ace_name.ace_function,
.ace-nova-edge-dark .ace_entity.ace_other,
.ace-nova-edge-dark .ace_entity.ace_other.ace_attribute-name,
.ace-nova-edge-dark .ace_variable {
  color: #F5E7D0;
}
.ace-nova-edge-dark .ace_variable.ace_parameter {
  font-style: italic;
  color: #D2C0AD;
}
.ace-nova-edge-dark .ace_string {
  color: #E8C9A0;
}
.ace-nova-edge-dark .ace_string.ace_regexp {
  color: #E8C9A0;
}
.ace-nova-edge-dark .ace_comment {
  color: #7A6452;
  font-style: italic;
}
.ace-nova-edge-dark .ace_comment.ace_doc,
.ace-nova-edge-dark .ace_comment.ace_doc.ace_tag {
  color: #8F7963;
}
.ace-nova-edge-dark .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y;
}
.ace-nova-edge-dark .ace_indent-guide-active {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;
}
.ace-nova-edge-dark .ace_meta.ace_selector {
  color: #E8C9A0;
}
.ace-nova-edge-dark .ace_heading {
  color: #F5E7D0;
}
.ace-nova-edge-dark .ace_list {
  color: #E8D8C4;
}
.ace-nova-edge-dark .ace_marker-layer .ace_active-line + .ace_selection,
.ace-nova-edge-dark .ace_selection.ace_start {
  background: #4A3323;
}
/* Autocomplete / searchbox inside dark editor */
.ace-nova-edge-dark .ace_search {
  background-color: #21170E;
  border: 1px solid #5A3A1F;
  color: #F5E7D0;
}
.ace-nova-edge-dark .ace_search_field {
  background-color: #15100B;
  border: 1px solid #4A3020;
  color: #E8D8C4;
}
.ace-nova-edge-dark .ace_searchbtn,
.ace-nova-edge-dark .ace_replacebtn {
  background-color: #2A1D14;
  border: 1px solid #5A3A1F;
  color: #F5E7D0;
}
.ace-nova-edge-dark .ace_searchbtn:hover,
.ace-nova-edge-dark .ace_replacebtn:hover {
  background-color: #3D2A1D;
  border-color: #E87918;
}
.ace-nova-edge-dark .ace_snippet-marker {
  background-color: rgba(232,121,24,0.15);
  border: 1px solid rgba(232,121,24,0.35);
}
/* Scrollbar for ace */
.ace-nova-edge-dark .ace_scrollbar::-webkit-scrollbar-thumb {
  background: rgba(201,154,108,0.28) !important;
}
.ace-nova-edge-dark .ace_scrollbar::-webkit-scrollbar-track {
  background: transparent !important;
}
`;

export function registerNovaEdgeDarkTheme(ace: any): void {
  if (!ace) return;
  try {
    // Avoid double registration
    try {
      const existing = ace.require('ace/theme/nova_edge_dark');
      if (existing) return;
    } catch (e) {
      // not registered yet
    }
    ace.define('ace/theme/nova_edge_dark-css', ['require', 'exports', 'module'], (require: any, exports: any) => {
      exports.cssText = NOVA_EDGE_DARK_CSS;
      exports.cssClass = 'ace-nova-edge-dark';
    });
    ace.define('ace/theme/nova_edge_dark', ['require', 'exports', 'module', 'ace/theme/nova_edge_dark-css', 'ace/lib/dom'], (require: any, exports: any) => {
      exports.isDark = true;
      exports.cssClass = 'ace-nova-edge-dark';
      exports.cssText = require('./nova_edge_dark-css').cssText;
      exports.$id = 'ace/theme/nova_edge_dark';
      const dom = require('../lib/dom');
      dom.importCssString(exports.cssText, exports.cssClass, false);
    });
    // Preload via require to inject CSS
    ace.require(['ace/theme/nova_edge_dark'], () => {});
  } catch (err) {
    // fallback: inject via DOM
    if (typeof document !== 'undefined' && !document.getElementById('ace-nova-edge-dark')) {
      const style = document.createElement('style');
      style.id = 'ace-nova-edge-dark';
      style.textContent = NOVA_EDGE_DARK_CSS;
      document.head.appendChild(style);
    }
  }
}

export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  // Must match HomeComponent.applyTheme(), which toggles the Material
  // `.tb-dark` class (defined in theme.scss). Do NOT check `ne-dark` — no
  // such rule exists, so the ACE theme would desync from the app theme.
  return document.body.classList.contains('tb-dark');
}

export function getAceTheme(): string {
  return isDarkMode() ? 'ace/theme/nova_edge_dark' : 'ace/theme/textmate';
}

export function applyAceTheme(editor: any): void {
  if (!editor || !editor.setTheme) return;
  try {
    editor.setTheme(getAceTheme());
  } catch (e) {}
}

// Track editors for live toggle without touching component code
const trackedEditors = new Set<any>();
let bodyObserver: MutationObserver | null = null;

export function trackAceEditor(editor: any): void {
  if (!editor) return;
  trackedEditors.add(editor);
  applyAceTheme(editor);
  // Override destroy to untrack
  const origDestroy = editor.destroy?.bind(editor);
  if (origDestroy && !(editor as any).__novaTracked) {
    (editor as any).__novaTracked = true;
    editor.destroy = function(...args: any[]) {
      trackedEditors.delete(editor);
      return origDestroy(...args);
    };
  }
  ensureBodyObserver();
}

export function ensureBodyObserver(): void {
  if (bodyObserver || typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  bodyObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'class') {
        // Check if dark changed
        const nowDark = isDarkMode();
        // Apply to all tracked editors
        trackedEditors.forEach((ed) => {
          try {
            const cur = ed.getTheme ? ed.getTheme() : '';
            const want = getAceTheme();
            if (cur !== want) ed.setTheme(want);
          } catch (e) {}
        });
      }
    }
  });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  // Also watch localStorage? home.component toggles via localStorage
  window.addEventListener('storage', () => {
    trackedEditors.forEach((ed) => applyAceTheme(ed));
  });
  // Listen to custom event if dispatched
  window.addEventListener('tb-dark-mode-changed', () => {
    trackedEditors.forEach((ed) => applyAceTheme(ed));
  });
}

export function updateAllTrackedAceThemes(): void {
  trackedEditors.forEach((ed) => applyAceTheme(ed));
}
