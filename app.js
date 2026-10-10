const COPY = {
  es: {
    title: "Jaime Alonso",
    description: "Jaime Alonso. Spirithz, Jaime 2000 y The Symphonic Quarteteuc.",
    missing: "Jaime",
    skip: "Saltar al contenido",
  },
  en: {
    title: "Jaime Alonso",
    description: "Jaime Alonso. Spirithz, Jaime 2000 and The Symphonic Quarteteuc.",
    missing: "Jaime",
    skip: "Skip to content",
  },
};

const ARTISTS = [
  {
    slug: "spirithz",
    name: "Spirithz",
    deezerArtist: "194659137",
    image: "/img/spirithz.jpg",
    eyebrow: { es: "trance", en: "trance" },
    tidal: "https://tidal.com/artist/36347288/u",
    spotify: "https://open.spotify.com/search/Spirithz",
    apple: "https://music.apple.com/us/artist/spirithz/1661265663",
    releases: [
      {
        title: "Spirithz of the depths",
        deezer: "1116101722",
        cover: "/img/spirithz.jpg",
      },
      {
        title: "Criaturas",
        deezer: "1106058932",
        cover: "/img/cover-criaturas.jpg",
      },
    ],
  },
  {
    slug: "jaime2000",
    name: "Jaime 2000",
    deezerArtist: "420530972",
    image: "/img/jaime-2000.jpg",
    eyebrow: { es: "indie", en: "indie" },
    tidal: "https://tidal.com/artist/87677903/u",
    spotify: "https://open.spotify.com/search/Jaime%202000",
    apple: "https://music.apple.com/us/artist/jaime-2000/6819618646",
    releases: [
      {
        title: "Neo-salvation",
        deezer: "1114778752",
        cover: "/img/jaime-2000.jpg",
      },
      {
        title: "Aura",
        deezer: "1114778422",
        cover: "/img/cover-aura.jpg",
      },
      {
        title: "Me fui, os quiero",
        deezer: "1114929242",
        cover: "/img/cover-mefui.jpg",
      },
    ],
  },
  {
    slug: "quarteteuc",
    name: "The Symphonic Quarteteuc",
    deezerArtist: "282398201",
    image: "/img/cover-tavern.jpg",
    eyebrow: { es: "hashiban", en: "hashiban" },
    tidal: "https://tidal.com/@quarteteuc",
    spotify: "https://open.spotify.com/search/The%20Symphonic%20Quarteteuc",
    apple: "https://music.apple.com/us/artist/the-symphonic-quarteteuc/1768849532",
    extra: {
      href: "https://verkami.com/projects/34129-la-subasta-de-hashiban",
      label: "Hashiban",
    },
    releases: [
      {
        title: "Tavern Whispers",
        deezer: "644549771",
        cover: "/img/cover-tavern.jpg",
      },
    ],
  },
];

const ICONS = {
  tidal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2 15.2 5.4 12 8.6 8.8 5.4zm0 7.2 3.2 3.2L12 15.8 8.8 12.6zM5.4 5.4 8.6 8.6 5.4 11.8 2.2 8.6zM18.6 5.4 21.8 8.6 18.6 11.8 15.4 8.6z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.2 10.1c3.2-1 6.6-.7 9.6.8M7.6 13c2.5-.7 5.2-.5 7.6.6M8.1 15.7c1.9-.5 3.9-.3 5.6.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.2 12.6c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.7-.7c-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7 1.8-1 2.5-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.2-.9-2.3-3.7zM14.7 6.8c.6-.7 1-1.7.9-2.8-1 .1-2.1.6-2.8 1.4-.6.7-1.1 1.7-.9 2.7 1.1.1 2.1-.5 2.8-1.3z"/></svg>`,
};

let lang = initialLang();
let releaseIndex = 0;

function initialLang() {
  const query = new URLSearchParams(location.search).get("lang");
  if (query === "es" || query === "en") return query;
  const stored = localStorage.getItem("jaime-lang");
  if (stored === "es" || stored === "en") return stored;
  return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
}

function artistBySlug(slug) {
  return ARTISTS.find((artist) => artist.slug === slug);
}

function currentPath() {
  let path = location.pathname.replace(/\/$/, "") || "/";
  if (path === "/jaime-2000") {
    path = "/jaime2000";
    history.replaceState({}, "", path + location.search);
  }
  return path;
}

function setLang(next) {
  lang = next;
  localStorage.setItem("jaime-lang", next);
  const url = new URL(location.href);
  url.searchParams.delete("lang");
  history.replaceState({}, "", url.pathname);
  document.documentElement.lang = next;
  render();
}

function scrollToTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

function navigate(path) {
  if (path === currentPath()) return;
  history.pushState({}, "", path);
  releaseIndex = 0;
  render();
  scrollToTop();
}

function render() {
  const path = currentPath();
  const copy = COPY[lang];
  const view = document.querySelector("#view");
  document.documentElement.lang = lang;
  document.querySelector(".skip").textContent = copy.skip;
  for (const button of document.querySelectorAll("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  }

  const artist = path === "/" ? null : artistBySlug(path.slice(1));
  document.body.dataset.world = artist ? artist.slug : "home";
  document.title = artist ? `${artist.name} — Jaime Alonso` : copy.title;
  document.querySelector('meta[name="description"]').setAttribute("content", copy.description);

  if (path === "/") view.innerHTML = home();
  else if (artist) view.innerHTML = stage(artist);
  else view.innerHTML = `<p class="missing"><a href="/" data-link="/">${copy.missing}</a></p>`;

  const heading = view.querySelector("h1");
  if (heading) heading.tabIndex = -1;
}

function home() {
  const cards = ARTISTS.map(
    (artist) => `
      <a class="card" href="/${artist.slug}" data-link="/${artist.slug}">
        <div class="shot">
          <img src="${artist.image}" alt="${artist.name}" />
        </div>
        <h2>${artist.name}</h2>
      </a>`
  ).join("");

  return `<section class="home">${cards}</section>`;
}

function stage(artist) {
  const release = artist.releases[releaseIndex] || artist.releases[0];
  const thumbs =
    artist.releases.length < 2
      ? ""
      : artist.releases
          .map((item, index) => {
            const current = index === releaseIndex ? ' aria-current="true"' : "";
            return `<button type="button" data-release="${index}"${current}><img src="${item.cover}" alt="${item.title}" /></button>`;
          })
          .join("");
  const extra = artist.extra
    ? `<a href="${artist.extra.href}" target="_blank" rel="noopener noreferrer">${artist.extra.label}</a>`
    : "";

  return `
    <article class="stage">
      <figure class="hero">
        <img src="${release.cover}" alt="${artist.name}" />
      </figure>
      <div class="panel">
        <p class="eyebrow">${artist.eyebrow[lang]}</p>
        <h1>${artist.name}</h1>
        <div class="releases">${thumbs}</div>
        <div class="player">
          ${
            release.spotify
              ? `<iframe title="${release.title}" src="https://open.spotify.com/embed/album/${release.spotify}?utm_source=generator&theme=0" loading="lazy" tabindex="-1" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`
              : `<iframe title="${release.title}" src="https://widget.deezer.com/widget/dark/album/${release.deezer}" loading="lazy" tabindex="-1" allow="encrypted-media; clipboard-write"></iframe>`
          }
        </div>
        <nav class="platforms">
          <a href="${artist.tidal}" target="_blank" rel="noopener noreferrer">${ICONS.tidal}<span>Tidal</span></a>
          <a href="${artist.spotify}" target="_blank" rel="noopener noreferrer">${ICONS.spotify}<span>Spotify</span></a>
          <a href="${artist.apple}" target="_blank" rel="noopener noreferrer">${ICONS.apple}<span>Apple Music</span></a>
          ${extra}
        </nav>
      </div>
    </article>`;
}

document.addEventListener("click", (event) => {
  const langButton = event.target.closest("[data-lang]");
  if (langButton) {
    setLang(langButton.dataset.lang);
    return;
  }
  const release = event.target.closest("[data-release]");
  if (release) {
    releaseIndex = Number(release.dataset.release);
    render();
    return;
  }
  const link = event.target.closest("[data-link]");
  if (link) {
    event.preventDefault();
    navigate(link.getAttribute("href"));
  }
});

window.addEventListener("popstate", () => {
  releaseIndex = 0;
  render();
  scrollToTop();
});

async function loadNewReleases() {
  const lists = await Promise.all(
    ARTISTS.map(async (artist) => {
      const response = await fetch(`/deezer/artist/${artist.deezerArtist}/albums?limit=40`);
      if (!response.ok) return [];
      const payload = await response.json();
      const known = new Set(artist.releases.map((release) => String(release.deezer)));
      return (payload.data || [])
        .filter((album) => album.id && !known.has(String(album.id)))
        .map((album) => ({
          title: album.title,
          deezer: String(album.id),
          cover: album.cover_xl || album.cover_big || album.cover_medium,
        }));
    })
  );

  let changed = false;
  ARTISTS.forEach((artist, index) => {
    const fresh = lists[index].filter((release) => release.cover);
    if (!fresh.length) return;
    artist.releases = [...fresh, ...artist.releases];
    changed = true;
  });
  if (changed && currentPath() !== "/") releaseIndex = 0;
  if (changed) render();
}

render();
loadNewReleases().catch(() => {});
