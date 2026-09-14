# Adding a post

1. Copy `posts/_template.md` to `posts/your-post-slug.md`.
2. Write the post in Markdown. Images render at their natural size, capped
   to the column width. To set an explicit width, append a hint:
   `![alt](./assets/photo.png){width=320}` or `{width=60%}`.
3. Add its metadata to `posts.json`:

```json
{
  "slug": "your-post-slug",
  "file": "your-post-slug.md",
  "title": "Your post title",
  "description": "A short factual description.",
  "date": "2026-08-13",
  "tags": ["example"]
}
```

The archive links to `post.html?slug=your-post-slug`. Everything remains static
and works on GitHub Pages without a server or build step.
