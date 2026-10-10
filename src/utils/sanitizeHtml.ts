/**
 * Sanitiza HTML vindo do CMS antes de renderizar via dangerouslySetInnerHTML.
 * Remove scripts, handlers de evento, javascript: URLs e elementos perigosos.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  if (typeof document === 'undefined') {
    // Without a standards-compliant HTML parser, fail closed: render the CMS
    // value as text rather than trying to sanitize arbitrary HTML with regex.
    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  const ALLOWED_TAGS = new Set([
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'blockquote', 'q', 'cite', 'abbr', 'address', 'pre', 'code',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'a', 'img', 'figure', 'figcaption', 'picture', 'source',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
    'video', 'audio', 'track',
    'details', 'summary', 'time', 'data', 'ruby', 'rt', 'rp',
  ]);

  const ALLOWED_ATTRS: Record<string, Set<string>> = {
    a: new Set(['href', 'title', 'target', 'rel']),
    img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
    source: new Set(['src', 'media', 'type']),
    video: new Set(['src', 'controls', 'poster', 'width', 'height']),
    audio: new Set(['src', 'controls']),
    track: new Set(['src', 'kind', 'srclang', 'label']),
    td: new Set(['colspan', 'rowspan']),
    th: new Set(['colspan', 'rowspan', 'scope']),
    col: new Set(['span']),
    colgroup: new Set(['span']),
    time: new Set(['datetime']),
    data: new Set(['value']),
    '*': new Set(['class', 'id', 'lang', 'dir', 'title', 'role']),
  };

  const DANGEROUS_TAGS = new Set([
    'script', 'style', 'iframe', 'object', 'embed', 'applet',
    'form', 'input', 'textarea', 'select', 'button', 'meta', 'link',
    'base', 'noscript', 'template', 'slot',
  ]);

  function walk(node: Element) {
    const children = Array.from(node.children);
    for (const child of children) {
      const tag = child.tagName.toLowerCase();

      if (DANGEROUS_TAGS.has(tag)) {
        child.remove();
        continue;
      }

      if (!ALLOWED_TAGS.has(tag)) {
        // Desempacota elemento não permitido, mantendo conteúdo
        const parent = child.parentNode;
        if (parent) {
          while (child.firstChild) parent.insertBefore(child.firstChild, child);
          parent.removeChild(child);
          // Re-walk os nós movidos
          continue;
        }
      }

      // Limpar atributos
      const allowed = ALLOWED_ATTRS[tag] ?? ALLOWED_ATTRS['*'];
      const attrs = Array.from(child.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        // Remove todos os handlers de evento
        if (name.startsWith('on')) {
          child.removeAttribute(attr.name);
          continue;
        }

        // Apenas atributos permitidos
        if (!allowed.has(name) && !ALLOWED_ATTRS['*'].has(name)) {
          child.removeAttribute(attr.name);
          continue;
        }

        // Allow only safe URL schemes. Relative URLs are allowed; active content
        // schemes (javascript:, data:, vbscript:, file:) are always rejected.
        if (name === 'href' || name === 'src' || name === 'poster') {
          const trimmed = value.trim();
          const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
          const safeScheme = /^(https?:|mailto:|tel:)/i.test(trimmed);
          if (/^(javascript:|data:|vbscript:|file:)/i.test(trimmed) || (hasScheme && !safeScheme)) {
            child.removeAttribute(attr.name);
            continue;
          }
        }

        // Links externos: força rel seguro
        if (tag === 'a' && name === 'href' && /^https?:\/\//i.test(value)) {
          child.setAttribute('rel', 'noopener noreferrer');
        }
      }

      walk(child);
    }
  }

  const body = doc.body;
  if (body) {
    walk(body);
    return body.innerHTML;
  }

  return '';
}
