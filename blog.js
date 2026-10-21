(() => {
  const storageKey = 'spr-blog-posts-v1';
  const toggle = document.getElementById('add-post-toggle');
  const form = document.getElementById('post-editor');
  const list = document.getElementById('post-list');
  const emptyState = document.getElementById('post-empty');
  const cancel = document.getElementById('cancel-post');
  const message = document.getElementById('editor-message');
  const dateInput = document.getElementById('post-date');

  if (!toggle || !form || !list || !emptyState || !dateInput) return;

  const today = new Date();
  dateInput.value = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

  function readPosts() {
    try {
      const posts = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(posts) ? posts.filter((post) => post && post.title && post.summary && post.body && post.date) : [];
    } catch {
      return [];
    }
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }

  function renderPosts() {
    list.replaceChildren();
    const posts = readPosts().sort((a, b) => b.date.localeCompare(a.date));
    emptyState.hidden = posts.length > 0;

    posts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'surface blog-post';

      const meta = document.createElement('p');
      meta.className = 'eyebrow blog-post-meta';
      meta.textContent = [post.category, formatDate(post.date)].filter(Boolean).join(' / ');

      const title = document.createElement('h2');
      title.textContent = post.title;

      const summary = document.createElement('p');
      summary.className = 'blog-post-summary';
      summary.textContent = post.summary;

      const body = document.createElement('p');
      body.className = 'blog-post-body';
      body.textContent = post.body;

      article.append(meta, title, summary, body);
      list.append(article);
    });
  }

  function setEditorOpen(open) {
    form.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close post editor' : 'Add a post');
    toggle.innerHTML = open ? '<span aria-hidden="true">-</span> Close editor' : '<span aria-hidden="true">+</span> Add a post';
    if (open) document.getElementById('post-title')?.focus();
  }

  toggle.addEventListener('click', () => setEditorOpen(form.hidden));
  cancel?.addEventListener('click', () => setEditorOpen(false));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const post = {
      title: String(data.get('title') || '').trim(),
      category: String(data.get('category') || '').trim(),
      date: String(data.get('date') || ''),
      summary: String(data.get('summary') || '').trim(),
      body: String(data.get('body') || '').trim()
    };

    try {
      const posts = readPosts();
      posts.push(post);
      localStorage.setItem(storageKey, JSON.stringify(posts));
      form.reset();
      dateInput.value = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
      message.textContent = 'Post saved in this browser.';
      renderPosts();
      document.getElementById('post-title')?.focus();
    } catch {
      message.textContent = 'This browser could not save the post. Check its storage settings and try again.';
    }
  });

  renderPosts();
})();
