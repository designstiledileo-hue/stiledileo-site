"""Refresh the shared static shell. No runtime template or new routing layer."""
import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FLAGS = re.I | re.S
EXCLUDED = {"car.html", "thank-you.html", "furniture-thank-you.html"}
WORK = {
    "projects.html", "brookswood-langley-fireplace-transformation.html",
    "west-vancouver-fireplace-transformation.html", "custom-architectural-rock-installation.html",
    "plaster-range-hood-vancouver.html", "furniture.html", "marmorino-retail-interiors.html",
    "holt-renfrew-limewash-vancouver.html",
}
TRADE = {"holt-renfrew-limewash-vancouver.html", "marmorino-retail-interiors.html", "commercial-limewash-vancouver.html"}
NAV = (
    ("/#services", "Services"), ("/projects.html", "Projects"),
    ("/#textures", "Materials"), ("/#trade", "For Trade"), ("/blog.html", "Journal"),
    ("/#contact", "Contact"),
)
STYLE = '<link rel="stylesheet" href="/styles/site-navigation.css">'
SCRIPT = '<script src="/scripts/home-navigation.js" defer></script>'
HREF = re.compile(r"""\bhref=(["'])(.*?)\1""", FLAGS)
ANCHOR = re.compile(r"(<a\b[^>]*>)(.*?)</a>", FLAGS)


def clean(value):
    return " ".join(html.unescape(re.sub(r"<[^>]*>", "", value)).split())


def nav_link(href, title, current):
    selected = ' aria-current="page"' if href == "/" + current else ""
    return f'<a href="{html.escape(href, quote=True)}"{selected}>{html.escape(title)}</a>'


def secondary_links(markup, file):
    if file == "index.html":
        return ""
    avoid = {href for href, _ in NAV} | {
        "/", "/" + file, "/furniture.html", "/#estimate", "/#estimate-photo", "/#estimate-commercial", "#inquiry",
    }
    links = []
    for start, label in ANCHOR.findall(markup):
        match = HREF.search(start)
        if not match:
            continue
        href = html.unescape(match[2])
        title = clean(label)
        if not title or href in avoid or href.startswith(("tel:", "mailto:")):
            continue
        avoid.add(href)
        links.append(nav_link(href, title, file))
    return " ".join(links)


def header(file, context):
    tone = "work" if file in WORK else "reading"
    if file == "furniture.html":
        route, title, extra = "#inquiry", "Enquire About Furniture", ' data-track="none"'
    elif file in TRADE:
        route, title, extra = "/#estimate-commercial", "Discuss a Commercial Project", ' data-track="estimate" data-estimate-type="commercial"'
    else:
        route, title, extra = "/#estimate", "Request an Estimate", ' data-track="estimate"'
    if file == "index.html":
        extra += ' data-cta-id="home_nav_estimate"'
    action = f'<a class="stile-primary" href="{route}"{extra}>{title}</a>'
    links = " ".join(nav_link(href, text, file) for href, text in NAV)
    brand = '<a class="stile-brand" href="/" aria-label="Stile di Leo home">Stile di <em>Leo</em></a>'
    footer_contact = '<a href="tel:+16047732298">Call +1 (604) 773-2298</a>'
    context_nav = f'\n    <nav class="stile-context" aria-label="Related pages">{context}</nav>' if context else ""
    return f"""<!-- mineral-header -->
  <header class="stile-chrome stile-global-header" id="site-nav" data-tone="{tone}">
    <div class="stile-width stile-header-inner">
      {brand}
      <nav class="stile-links" aria-label="Main navigation">{links}</nav>
      {action}
      <details class="stile-menu">
        <summary>Menu</summary>
        <nav class="stile-menu-links" aria-label="Mobile navigation" data-leo-blocking-overlay>{links}<a href="/furniture.html">Furniture</a>{footer_contact}</nav>
      </details>
    </div>{context_nav}
  </header>
  <!-- /mineral-header -->"""


def footer(file, context):
    tone = "work" if file in WORK else "reading"
    local = f'\n    <div class="stile-width"><nav class="stile-context" aria-label="Related links">{context}</nav></div>' if context else ""
    return f"""<!-- mineral-footer -->
  <footer class="stile-chrome stile-global-footer" data-tone="{tone}">
    <div class="stile-width stile-footer-inner">
      <div><a class="stile-brand" href="/">Stile di <em>Leo</em></a><p>Architectural surface finishes<br>Metro Vancouver, British Columbia</p></div>
      <nav class="stile-footer-links" aria-label="Explore"><a href="/#services">Services</a><a href="/projects.html">Projects</a><a href="/#textures">Materials</a><a href="/#trade">For Trade</a><a href="/blog.html">Journal</a><a href="/furniture.html">Furniture Concepts</a></nav>
      <nav class="stile-footer-links" aria-label="Contact"><a href="/#estimate" data-track="estimate">Request an Estimate</a><a href="/#estimate-photo" data-track="send_photo">Send a Project Photo</a><a href="/#estimate-commercial" data-track="estimate" data-estimate-type="commercial">Discuss a Commercial Project</a><a href="tel:+16047732298">Call +1 (604) 773-2298</a><a href="mailto:designstiledileo@gmail.com">Email Stile di Leo</a></nav>
    </div>{local}
    <p class="stile-width stile-copyright">© 2026 Stile di Leo</p>
  </footer>
  <!-- /mineral-footer -->"""


def migrate_cta(match, file):
    tag, content = match.groups()
    label = clean(content)
    ref = HREF.search(tag)
    if not ref or ref[2] not in {"/#estimate", "/#contact"} or not label:
        return match[0]
    photo = re.search(r"\bphotos?\b", label, re.I) and not re.search(r"\b(?:view|see|process)\b", label, re.I)
    estimate = ref[2] == "/#estimate" or re.search(r"enquir|estimate|consultation|discuss (?:a|your)|get (?:a|an)|quote", label, re.I)
    if not photo and not estimate:
        return match[0]
    commercial = not photo and file in TRADE
    target = "/#estimate-photo" if photo else "/#estimate-commercial" if commercial else "/#estimate"
    tag = HREF.sub(f'href="{target}"', tag, count=1)
    track = 'send_photo' if photo else 'estimate'
    tag = re.sub(r'\sdata-track=(["\']).*?\1', "", tag, flags=FLAGS)
    attrs = f' data-track="{track}"' + (' data-estimate-type="commercial"' if commercial else "")
    classes = re.search(r"""\bclass=(["'])(.*?)\1""", tag, FLAGS)
    # A link in sentence copy stays inline. Normalize only existing button treatments.
    if classes and not photo and re.search(r"\b(?:btn|button|cta-btn|cta-primary|nav-cta)\b", classes[2]):
        tag = tag[:classes.start(2)] + classes[2] + " stile-action" + tag[classes.end(2):]
        if re.search(r"^\s*[^<]+\s*$", content):
            content = "Discuss a Commercial Project" if commercial else "Request an Estimate"
    return tag[:-1] + attrs + ">" + content + "</a>"


def generate(file, source):
    head, suffix = re.split(r"(?=</head>)", source, maxsplit=1, flags=re.I)
    closing, body = re.split(r"(?=<body\b)", suffix, maxsplit=1, flags=re.I)
    head = re.sub(r'\s*<link\b[^>]*href="/styles/site-navigation.css"[^>]*>', "", head)
    head = re.sub(r'\s*<script src="/scripts/home-navigation.js" defer></script>', "", head)
    head = head.rstrip() + "\n  " + STYLE + "\n  " + SCRIPT + "\n"
    oldhead = re.search(r"<!-- mineral-header -->.*?<!-- /mineral-header -->", body, FLAGS)
    if oldhead:
        context = re.search(r'<nav class="stile-context"[^>]*>(.*?)</nav>', oldhead[0], FLAGS)
        body = body[:oldhead.start()] + header(file, context[1] if context else "") + body[oldhead.end():]
    else:
        oldhead = re.search(r'(<body\b[^>]*>\s*(?:<a\b[^>]*class="skip-link"[^>]*>.*?</a>\s*)?)(?:(<!--.*?-->\s*))?(<(header|nav)\b[^>]*>.*?</\4>)', body, FLAGS)
        if file == "index.html":
            oldhead = re.search(r'<header class="masthead"[^>]*>.*?</header>', body, FLAGS)
            if not oldhead:
                raise ValueError("expected existing homepage masthead")
            body = body[:oldhead.start()] + header(file, "") + body[oldhead.end():]
        elif oldhead and not re.search(r"<h1\b|<form\b", oldhead[3], FLAGS):
            body = body[:oldhead.start(3)] + header(file, secondary_links(oldhead[3], file)) + body[oldhead.end(3):]
        else:
            raise ValueError(f"{file}: no recognizable standalone original header")
    oldfooter = re.search(r"<!-- mineral-footer -->.*?<!-- /mineral-footer -->", body, FLAGS)
    if oldfooter:
        context = re.search(r'<nav class="stile-context"[^>]*>(.*?)</nav>', oldfooter[0], FLAGS)
    else:
        oldfooter = re.search(r"<footer\b[^>]*>.*?</footer>", body, FLAGS)
        context = None
    if oldfooter:
        preserved = context[1] if context else secondary_links(oldfooter[0], file)
        body = body[:oldfooter.start()] + footer(file, preserved) + body[oldfooter.end():]
    else:
        body = re.sub(r"</body>", lambda m: "\n  " + footer(file, "") + "\n" + m[0], body, count=1, flags=re.I)
    if file != "index.html":
        def body_class(m):
            source = m[0]
            current = re.search(r"""\bclass=(["'])(.*?)\1""", source)
            if current and "mineral-site" not in current[2].split():
                return source[:current.start(2)] + "mineral-site " + source[current.start(2):]
            return source if current else source[:-1] + ' class="mineral-site">'
        body = re.sub(r"<body\b[^>]*>", body_class, body, count=1, flags=re.I)
        if "<!-- mineral-header -->" not in suffix:
            # Style and attribute rules apply strictly to visible anchors outside
            # the generated shell; script bodies and metadata are not transformed.
            blocks = re.split(r"((?:<!-- mineral-(?:header|footer) -->).*?(?:<!-- /mineral-(?:header|footer) -->)|<script\b[^>]*>.*?</script>)", body, flags=FLAGS)
            body = "".join(part if i % 2 else ANCHOR.sub(lambda m: migrate_cta(m, file), part) for i, part in enumerate(blocks))
    return head + closing + body


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="apply the mechanical shared-shell normalization")
    args = parser.parse_args()
    changed = []
    for path in sorted(ROOT.glob("*.html")):
        if path.name in EXCLUDED:
            continue
        old = path.read_text()
        new = generate(path.name, old)
        if old != new:
            changed.append((path, new))
    journal_module = ROOT / "netlify/lib/mineral-journal-shell.mts"
    journal_output = "// Generated by scripts/sync-mineral-shell.py.\n" + "\n".join(
        f"export const {key} = {json.dumps(value, ensure_ascii=False)};"
        for key, value in (
            ("journalHead", STYLE + SCRIPT),
            ("journalHeader", header("blog.html", "")),
            ("journalFooter", footer("blog.html", "")),
        )
    ) + "\n"
    if not journal_module.is_file() or journal_module.read_text() != journal_output:
        changed.append((journal_module, journal_output))
    if args.write:
        for path, new in changed:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(new)
    print(f"{len(changed)} file(s) {'updated' if args.write else 'needing update'}")
    if changed and not args.write:
        print("\n".join(path.name for path, _ in changed))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
