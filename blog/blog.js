(function () {
  'use strict';

  const manifestUrl = 'posts.json';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.valueOf())) return value;
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  }

  function entryLanguage(entry) {
    const language = entry && typeof entry.language === 'string' ? entry.language : '';
    return /^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/.test(language) ? language : 'en';
  }

  function inlineMarkdown(value) {
    let text = escapeHtml(value);
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, function (_, label, href) {
      const decodedHref = href.replace(/&amp;/g, '&');
      const allowed = /^(https?:\/\/|mailto:|#|\.\.?\/)/.test(decodedHref);
      if (!allowed) return label;
      const external = /^https?:\/\//.test(decodedHref);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    text = text.replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>');
    return text;
  }

  function headingId(value) {
    const id = value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-');
    return id || 'section';
  }

  function renderMarkdown(source) {
    const lines = source.replace(/\r\n?/g, '\n').split('\n');
    const output = [];
    let paragraph = [];
    let listType = null;
    let listItems = [];
    let quote = [];
    let inCode = false;
    let codeLanguage = '';
    let codeLines = [];

    function flushParagraph() {
      if (!paragraph.length) return;
      output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }

    function flushList() {
      if (!listType) return;
      output.push(`<${listType}>${listItems.map(item => `<li>${inlineMarkdown(item)}</li>`).join('')}</${listType}>`);
      listType = null;
      listItems = [];
    }

    function flushQuote() {
      if (!quote.length) return;
      output.push(`<blockquote><p>${inlineMarkdown(quote.join(' '))}</p></blockquote>`);
      quote = [];
    }

    function flushTextBlocks() {
      flushParagraph();
      flushList();
      flushQuote();
    }

    lines.forEach(function (line) {
      const fence = line.match(/^```\s*([\w-]*)\s*$/);
      if (fence) {
        if (inCode) {
          const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
          output.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          inCode = false;
          codeLanguage = '';
          codeLines = [];
        } else {
          flushTextBlocks();
          inCode = true;
          codeLanguage = fence[1] || '';
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      if (!line.trim()) {
        flushTextBlocks();
        return;
      }

      // Optional size hint: ![alt](src){width=320} or {width=60%}
      const image = line.match(/^!\[([^\]]*)\]\(([^\s)]+)\)(?:\{width=(\d{1,4}%?)\})?$/);
      if (image) {
        flushTextBlocks();
        const alt = image[1].trim();
        const src = image[2];
        const width = image[3] ? (image[3].endsWith('%') ? image[3] : `${image[3]}px`) : '';
        const style = width ? ` style="width:${width}"` : '';
        const allowed = /^(https?:\/\/|\.\.?\/)/.test(src);
        if (allowed) {
          output.push(
            `<figure class="blog-figure"${style}><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ''}</figure>`
          );
        } else {
          paragraph.push(alt || src);
        }
        return;
      }

      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushTextBlocks();
        const level = heading[1].length;
        const label = heading[2].trim();
        output.push(`<h${level} id="${headingId(label)}">${inlineMarkdown(label)}</h${level}>`);
        return;
      }

      if (/^(---|___|\*\*\*)\s*$/.test(line)) {
        flushTextBlocks();
        output.push('<hr />');
        return;
      }

      const unordered = line.match(/^\s*[-+*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        flushQuote();
        const nextType = unordered ? 'ul' : 'ol';
        if (listType && listType !== nextType) flushList();
        listType = nextType;
        listItems.push((unordered || ordered)[1]);
        return;
      }

      const blockquote = line.match(/^>\s?(.*)$/);
      if (blockquote) {
        flushParagraph();
        flushList();
        quote.push(blockquote[1]);
        return;
      }

      flushList();
      flushQuote();
      paragraph.push(line.trim());
    });

    if (inCode) {
      output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    }
    flushTextBlocks();
    return output.join('\n');
  }

  async function loadManifest() {
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load the post manifest.');
    const entries = await response.json();
    if (!Array.isArray(entries)) throw new Error('The post manifest is not an array.');
    return entries
      .filter(entry => entry && entry.slug && entry.file && entry.title && entry.date)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function renderError(container, code, message) {
    container.innerHTML = `
      <div class="blog-error">
        <p class="blog-error-code">${escapeHtml(code)}</p>
        <p>${escapeHtml(message)}</p>
      </div>`;
  }

  async function renderIndex() {
    const list = document.querySelector('[data-blog-list]');
    const count = document.querySelector('[data-blog-count]');
    if (!list || !count) return;

    try {
      const entries = await loadManifest();
      count.textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;

      if (!entries.length) {
        list.innerHTML = `
          <div class="blog-empty">
            <p class="blog-empty-code">ARCHIVE_READY / 000</p>
            <p>No entries yet. This page is ready when there is something worth keeping.</p>
          </div>`;
        return;
      }

      list.innerHTML = entries.map(entry => {
        const tags = Array.isArray(entry.tags) ? entry.tags : [];
        const language = entryLanguage(entry);
        return `
          <a class="blog-entry" lang="${escapeHtml(language)}" href="post.html?slug=${encodeURIComponent(entry.slug)}">
            <time class="blog-entry-date" datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
            <div>
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.description || '')}</p>
              ${tags.length ? `<div class="blog-entry-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
            </div>
            <span class="blog-entry-arrow" aria-hidden="true">→</span>
          </a>`;
      }).join('');
    } catch (error) {
      count.textContent = 'Unavailable';
      renderError(list, 'ARCHIVE_ERROR', error.message);
    }
  }

  async function renderPost() {
    const root = document.querySelector('[data-post-root]');
    if (!root) return;

    const slug = new URLSearchParams(window.location.search).get('slug') || '';
    if (!/^[a-z0-9-]+$/.test(slug)) {
      renderError(root, 'ENTRY_NOT_FOUND', 'Choose a post from the writing archive.');
      return;
    }

    try {
      const entries = await loadManifest();
      const entry = entries.find(item => item.slug === slug);
      if (!entry) throw new Error('This entry is not listed in the archive.');
      if (!/^[a-zA-Z0-9._-]+\.md$/.test(entry.file)) throw new Error('The post filename is invalid.');

      const response = await fetch(`posts/${entry.file}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('The Markdown file could not be loaded.');
      const markdown = await response.text();
      const tags = Array.isArray(entry.tags) ? entry.tags : [];
      const language = entryLanguage(entry);

      document.title = `${entry.title} | Cato Lin`;
      document.documentElement.lang = language;
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = entry.description || 'A note by Yi-Ting Cato Lin.';

      root.innerHTML = `
        <article lang="${escapeHtml(language)}">
          <header class="blog-post-header">
            <div class="blog-post-meta">
              <time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
              ${tags.map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}
            </div>
            <h1>${escapeHtml(entry.title)}</h1>
            <p class="blog-post-deck">${escapeHtml(entry.description || '')}</p>
          </header>
          <div class="blog-prose">${renderMarkdown(markdown)}</div>
        </article>`;
    } catch (error) {
      renderError(root, 'ENTRY_ERROR', error.message);
    }
  }

  if (document.body.hasAttribute('data-blog-index')) renderIndex();
  if (document.body.hasAttribute('data-blog-post')) renderPost();
})();
