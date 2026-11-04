#!/usr/bin/env python3
"""Build the static Direct Help Center: python3 help/direct/build.py.

Content and editorial date come from help-center.en.md. The root index supplies
its shared header and footer; generated articles need no JavaScript to be read.
"""
from pathlib import Path
from datetime import date
import html
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
BASE = '/help/direct/'
ORIGIN = 'https://launchmeapp.com'
SOURCE = (ROOT / 'help-center.en.md').read_text()
SHELL = (ROOT / 'index.html').read_text()
UPDATED = date.fromisoformat(re.search(r'Documentation updated: (\d{4}-\d{2}-\d{2})', SOURCE)[1])
DISPLAY_DATE = f'{UPDATED:%B} {UPDATED.day}, {UPDATED.year}'


def slug(value):
    return re.sub(r'[^a-z0-9\s-]', '', value.lower()).strip().replace(' ', '-')


groups = []
for chunk in re.split(r'^## ', SOURCE, flags=re.M)[1:]:
    title, body = chunk.split('\n', 1)
    group_id = slug(title)
    route = 'launcher' if group_id == 'full-screen-launcher' else group_id
    articles = []
    for part in re.split(r'^### ', body, flags=re.M)[1:]:
        name, content = part.split('\n', 1)
        intro, content = content.strip().split('\n\n', 1)
        article_slug = 'spaces' if group_id == 'dock' and name == 'Dock Spaces' else slug(name)
        articles.append(dict(title=name, id=group_id + '--' + slug(name),
                             url=f'{BASE}{route}/{article_slug}/', intro=intro,
                             content=content, group=group_id))
    groups.append(dict(title='Full Screen Launcher' if route == 'launcher' else title,
                       id=group_id, articles=articles))

articles = [article for group in groups for article in group['articles']]
anchors = {article['id']: article['url'] for article in articles}
used_ids = set(anchors)
# Reserve all headings before rendering so every cross-reference can be resolved.
for article in articles:
    article['headings'] = []
    for title in re.findall(r'^#### (.+)$', article['content'], flags=re.M):
        base = article['group'] + '--' + slug(title)
        identifier, suffix = base, 2
        while identifier in used_ids:
            identifier = base + '-' + str(suffix)
            suffix += 1
        used_ids.add(identifier)
        article['headings'].append(identifier)
        anchors[identifier] = article['url'] + '#' + identifier

files = {'full-screen-launcher.en.md': 'full-screen-launcher',
         'notch.en.md': 'notch', 'dock.en.md': 'dock', 'music.en.md': 'music'}


def resolve_url(value, group):
    if value.startswith('#'):
        return anchors[group + '--' + value[1:]]
    filename, _, anchor = value.partition('#')
    if filename in files:
        target_group = files[filename]
        if anchor:
            return anchors[target_group + '--' + anchor]
        return next(g for g in groups if g['id'] == target_group)['articles'][0]['url']
    return value


def inline(value, group):
    value = html.escape(value, quote=False)
    value = re.sub(r'`([^`]+)`', r'<code>\1</code>', value)
    value = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', value)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                  lambda match: '<a href="' + html.escape(resolve_url(html.unescape(match[2]), group), quote=True)
                  + '">' + match[1] + '</a>', value)


def render(article):
    output = []
    lines = article['content'].strip().splitlines()
    headings = iter(article['headings'])
    group = article['group']
    index = 0
    while index < len(lines):
        line = lines[index]
        if not line.strip():
            index += 1
        elif line.startswith('#### '):
            output.append(f'<h2 id="{next(headings)}">{inline(line[5:], group)}</h2>')
            index += 1
        elif re.match(r'^(?:- |\d+\. )', line):
            tag = 'ol' if re.match(r'^\d+\.', line) else 'ul'
            output.append('<' + tag + '>')
            while index < len(lines) and re.match(r'^(?:- |\d+\. )', lines[index]):
                item = re.sub(r'^(?:- |\d+\. )', '', lines[index])
                output.append('<li>' + inline(item, group) + '</li>')
                index += 1
            output.append('</' + tag + '>')
        elif line.startswith('|'):
            rows = []
            while index < len(lines) and lines[index].startswith('|'):
                rows.append([cell.strip() for cell in lines[index].strip('|').split('|')])
                index += 1
            output.append('<div class="direct-table"><table><thead><tr>'
                          + ''.join('<th scope="col">' + inline(cell, group) + '</th>' for cell in rows[0])
                          + '</tr></thead><tbody>')
            for row in rows[2:]:
                output.append('<tr>' + ''.join('<td>' + inline(cell, group) + '</td>' for cell in row) + '</tr>')
            output.append('</tbody></table></div>')
        else:
            paragraph = [line]
            index += 1
            while index < len(lines) and lines[index].strip() and not re.match(r'^(#### |\||- |\d+\. )', lines[index]):
                paragraph.append(lines[index])
                index += 1
            output.append('<p>' + inline(' '.join(paragraph), group) + '</p>')
    return '\n'.join(output)


def navigation(current=None):
    output = ['<aside class="help-sidebar" aria-label="Help topics navigation">',
              '<a class="lp-btn lp-btn--gray help-sidebar-btn" href="/help/">Mac App Store Help</a>',
              '<nav class="help-nav" aria-label="Help topics"><h2 class="help-nav-title">Topics</h2>']
    for index, group in enumerate(groups):
        active = current['group'] == group['id'] if current else index == 0
        output.append(f'<details class="direct-group" data-group="{group["id"]}"' + (' open' if active else '') + '>')
        output.append(f'<summary>{group["title"]}<span class="direct-chevron" aria-hidden="true"></span></summary><ul class="direct-subtopics">')
        for article in group['articles']:
            selected = ' aria-current="page"' if current and article['url'] == current['url'] else ''
            output.append(f'<li><a class="direct-subtopic" href="{article["url"]}"{selected}>{html.escape(article["title"])}</a></li>')
        output.append('</ul></details>')
    output.append('</nav></aside>')
    return '\n'.join(output)


def metadata():
    return (f'<p class="direct-meta">Documentation updated <time datetime="{UPDATED.isoformat()}">{DISPLAY_DATE}</time>'
            '<span aria-hidden="true"> · </span> Website version'
            '<span aria-hidden="true"> · </span> macOS 26 &amp; 27</p>')


def document(main, title, description, url):
    page = re.sub(r'    <main\b.*?</main>', lambda _: main, SHELL, count=1, flags=re.S)
    page = re.sub(r'<title>.*?</title>', lambda _: '<title>' + html.escape(title) + '</title>', page, count=1)
    values = {'description': description, 'og:title': title, 'og:description': description,
              'og:url': ORIGIN + url, 'twitter:title': title,
              'twitter:description': description, 'twitter:url': ORIGIN + url}
    for key, value in values.items():
        pattern = r'(<meta (?:name|property)="' + re.escape(key) + r'" content=")[^"]*(">)'
        page = re.sub(pattern, lambda m: m[1] + html.escape(value, quote=True) + m[2], page)
    page = re.sub(r'<link rel="canonical" href="[^"]*">',
                  '<link rel="canonical" href="' + ORIGIN + url + '">', page)
    page = re.sub(r'    <meta name="keywords"[^>]*>\n', '', page)
    return page


for article in articles:
    group = next(g for g in groups if g['id'] == article['group'])
    main = f'''    <main class="help-main container direct-article-page">
        <nav class="direct-breadcrumb" aria-label="Breadcrumb"><a href="{BASE}">Help Center</a><span aria-hidden="true"> / </span><a href="{BASE}#{group['id']}">{group['title']}</a></nav>
        <div class="help-layout">
            <article class="help-content help-topic direct-article" id="{article['id']}" aria-labelledby="article-title">
                <p class="direct-eyebrow">{group['title']}</p>
                <h1 id="article-title">{html.escape(article['title'])}</h1>
                {metadata()}
                <p class="direct-lead">{inline(article['intro'], article['group'])}</p>
                {render(article)}
            </article>
            {navigation(article)}
        </div>
    </main>'''
    output = ROOT / article['url'].removeprefix(BASE) / 'index.html'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(document(main, f'{article["title"]} — {group["title"]} | LaunchMe Help', article['intro'], article['url']))

sections = []
for group in groups:
    links = '\n'.join(f'<li><a href="{a["url"]}">{html.escape(a["title"])}</a></li>' for a in group['articles'])
    sections.append(f'<section class="direct-overview-group" id="{group["id"]}"><h2>{group["title"]}</h2><ul>{links}</ul></section>')
main = f'''    <main class="help-main container">
        <h1>Help Center</h1>
        <p class="help-intro">Guides for the LaunchMe website version. Explore the launcher, Notch, Dock, and Music.</p>
        {metadata()}
        <div class="help-layout">
            <div class="help-content direct-overview">
                <p>New to LaunchMe? <a href="{articles[0]['url']}">Start with installation and first launch</a>, or choose a guide below.</p>
                {''.join(sections)}
            </div>
            {navigation()}
        </div>
    </main>'''
(ROOT / 'index.html').write_text(document(main, 'LaunchMe Help Center | Launcher, Notch, Dock & Music Guides',
    'Set up and customize LaunchMe on macOS 26 and 27. Read guides for the full-screen launcher, Notch, Dock, Music, widgets, Spaces, and permissions.', BASE))
(ROOT / 'legacy-links.json').write_text(json.dumps(anchors, indent=2) + '\n')
namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', namespace)
sitemap = ET.Element('{' + namespace + '}urlset')
for url in [BASE] + [a['url'] for a in articles]:
    entry = ET.SubElement(sitemap, 'url')
    ET.SubElement(entry, 'loc').text = ORIGIN + url
    ET.SubElement(entry, 'lastmod').text = UPDATED.isoformat()
ET.indent(sitemap)
ET.ElementTree(sitemap).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
print(f'Built {len(articles)} articles, overview, legacy links, and local sitemap.')
