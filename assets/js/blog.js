// Blog index: search, tag filters, and sort. State is mirrored to the URL
// (?q=&tag=&sort=) so filtered views are linkable.
(function () {
  const posts = (window.BLOG_POSTS || []).slice();
  const listEl = document.getElementById("post-list");
  const searchEl = document.getElementById("post-search");
  const sortEl = document.getElementById("post-sort");
  const tagsEl = document.getElementById("tag-filters");
  const countEl = document.getElementById("post-count");

  const SORTS = {
    newest: (a, b) => b.date.localeCompare(a.date),
    oldest: (a, b) => a.date.localeCompare(b.date),
    shortest: (a, b) => a.minutes - b.minutes || b.date.localeCompare(a.date),
    longest: (a, b) => b.minutes - a.minutes || b.date.localeCompare(a.date),
    title: (a, b) => a.title.localeCompare(b.title),
  };

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get("q") || "",
    tag: params.get("tag") || "",
    sort: SORTS[params.get("sort")] ? params.get("sort") : "newest",
  };

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const tagCount = (t) => posts.filter((p) => p.tags.includes(t)).length;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString(undefined,
    { year: "numeric", month: "short", day: "numeric" });

  function renderTags() {
    const chip = (value, label) =>
      `<button type="button" class="tag-chip${state.tag === value ? " active" : ""}" data-tag="${esc(value)}" aria-pressed="${state.tag === value}">${esc(label)}</button>`;
    tagsEl.innerHTML = chip("", `All (${posts.length})`) +
      allTags.map((t) => chip(t, `${t} (${tagCount(t)})`)).join("");
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    const shown = posts
      .filter((p) => !state.tag || p.tags.includes(state.tag))
      .filter((p) => !q || [p.title, p.summary, ...p.tags].join(" ").toLowerCase().includes(q))
      .sort(SORTS[state.sort]);

    countEl.textContent = `${shown.length} of ${posts.length} post${posts.length === 1 ? "" : "s"}`;
    if (!posts.length) {
      countEl.textContent = "";
      tagsEl.innerHTML = "";
      listEl.innerHTML = `<p class="no-posts">No posts yet — check back soon.</p>`;
      return;
    }
    listEl.innerHTML = shown.length ? shown.map((p) => `
      <article class="post-item">
        <h3><a href="/blog/${esc(p.slug)}/">${esc(p.title)}</a></h3>
        <div class="post-meta">${fmtDate(p.date)} &middot; ${p.minutes} min read
          &middot; <a href="/blog/${esc(p.slug)}/#comments">Comments</a></div>
        <p>${esc(p.summary)}</p>
        <div class="card-tags">${p.tags.map((t) => `<button type="button" class="badge tag-link" data-tag="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      </article>`).join("")
      : `<p class="no-posts">No posts match. <button type="button" class="link-btn" id="clear-filters">Clear filters</button></p>`;

    renderTags();
    const next = new URLSearchParams();
    if (state.q) next.set("q", state.q);
    if (state.tag) next.set("tag", state.tag);
    if (state.sort !== "newest") next.set("sort", state.sort);
    history.replaceState(null, "", location.pathname + (next.toString() ? "?" + next : ""));
  }

  searchEl.value = state.q;
  sortEl.value = state.sort;
  searchEl.addEventListener("input", () => { state.q = searchEl.value; render(); });
  sortEl.addEventListener("change", () => { state.sort = sortEl.value; render(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tag]");
    if (t) { state.tag = state.tag === t.dataset.tag && t.classList.contains("tag-link") ? "" : t.dataset.tag; render(); }
    if (e.target.id === "clear-filters") { state.q = ""; state.tag = ""; searchEl.value = ""; render(); }
  });

  render();
})();
