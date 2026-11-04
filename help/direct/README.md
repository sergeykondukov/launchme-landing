# Direct Help Center

All source and output for the website-download Help Center live in this directory.

- Edit `help-center.en.md`: `##` headings are topics, `###` headings are articles,
  the first paragraph of each article is its introduction, and `####` headings
  become sections inside the article.
- The `Documentation updated: YYYY-MM-DD` line records the editorial revision
  date. Change it when documentation is edited; it is not an app verification date.
- Rebuild from the repository root with `python3 help/direct/build.py`.
  No additional Python packages are needed.
- `build.py` keeps the shared header and footer from the overview `index.html`,
  then generates the overview, 54 standalone article pages, `legacy-links.json`,
  and `sitemap.xml`. Edit article content in Markdown rather than generated HTML.
- Every article has its own title, description, canonical URL, visible introduction,
  and documentation date. Articles and navigation work without JavaScript.
- `direct.js` only coordinates topic disclosures and forwards old overview hash
  links to the corresponding article. Old links need JavaScript for forwarding.
- The local sitemap is `/help/direct/sitemap.xml`. It can be submitted separately
  to search engines; the site-wide sitemap and robots.txt are outside this task.

If renaming or removing an article, also remove its previous generated directory
and preserve a redirect as appropriate. The builder does not delete directories.
