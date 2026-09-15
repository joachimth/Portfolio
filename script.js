const GITHUB_USERNAME = "joachimth";
const REPO_LIMIT = 10;
const EXCLUDED_REPOS = ["Portfolio"];

const repoGrid = document.getElementById("repoGrid");
const repoStatus = document.getElementById("repoStatus");
const header = document.querySelector(".site-header");
const hamburger = document.getElementById("hamburger");
const navBar = document.getElementById("navBar");
const navLinks = document.querySelectorAll(".nav-link");

const fallbackRepos = [
  {
    name: "alpaca-trading-bot",
    html_url: "https://github.com/joachimth/alpaca-trading-bot",
    description:
      "AI-powered autonomous daytrading bot using Alpaca API - Cloudflare Worker + D1.",
    language: "TypeScript",
    stargazers_count: 0,
    updated_at: "2026-09-15T16:05:04Z"
  },
  {
    name: "mattrin",
    html_url: "https://github.com/joachimth/mattrin",
    description:
      "Socratic math tutor for HTX students with a deterministic CAS core.",
    language: "TypeScript",
    stargazers_count: 0,
    updated_at: "2026-09-13T12:47:20Z"
  },
  {
    name: "speaker-design-mk2",
    html_url: "https://github.com/joachimth/speaker-design-mk2",
    description:
      "Next-gen loudspeaker design tool with physics engine, optimizer, and wizard UI.",
    language: "TypeScript",
    stargazers_count: 1,
    updated_at: "2026-09-09T18:18:34Z"
  },
  {
    name: "decibel-meter",
    html_url: "https://github.com/joachimth/decibel-meter",
    description:
      "Professional decibel meter web app with real-time SPL, spectrum analyzer, and dosimeter.",
    language: "TypeScript",
    stargazers_count: 0,
    updated_at: "2026-09-08T11:26:25Z"
  },
  {
    name: "carport-beregner",
    html_url: "https://github.com/joachimth/carport-beregner",
    description:
      "Statisk fordimensionering af carporte efter Eurocode 5 (DK NA).",
    language: "TypeScript",
    stargazers_count: 0,
    updated_at: "2026-08-03T10:55:05Z"
  },
  {
    name: "milair-dashboard",
    html_url: "https://github.com/joachimth/milair-dashboard",
    description:
      "Dashboard for MilAir Watch flight history data (Cloudflare D1 backend).",
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2026-08-02T20:45:35Z"
  },
  {
    name: "mk3-reference-loudspeaker",
    html_url: "https://github.com/joachimth/mk3-reference-loudspeaker",
    description: "Active 3-way DIY reference loudspeaker design project.",
    language: "Python",
    stargazers_count: 1,
    updated_at: "2026-07-31T12:47:13Z"
  },
  {
    name: "skur-beregner",
    html_url: "https://github.com/joachimth/skur-beregner",
    description:
      "Statisk fordimensionering af skure efter Eurocode 5 (DK) med tegninger og 3D.",
    language: "TypeScript",
    stargazers_count: 0,
    updated_at: "2026-07-19T10:28:43Z"
  },
  {
    name: "adsb-planes-mil",
    html_url: "https://github.com/joachimth/adsb-planes-mil",
    description: "ADSB tracker page for EU military aircraft.",
    language: "JavaScript",
    stargazers_count: 1,
    updated_at: "2026-07-12T20:09:34Z"
  },
  {
    name: "track-robot-v2",
    html_url: "https://github.com/joachimth/track-robot-v2",
    description: "Web Flasher for an ESP32-based tracked robot platform.",
    language: "C",
    stargazers_count: 2,
    updated_at: "2026-07-06T13:55:44Z"
  }
];

function formatDate(isoDate) {
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRepoCard(repo) {
  const description =
    repo.description?.trim() || "No description provided yet.";
  const language = repo.language || "Not specified";
  const stars = repo.stargazers_count ?? 0;
  const updated = formatDate(repo.updated_at);

  return `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
      <div class="repo-top">
        <div class="repo-name">${escapeHtml(repo.name)}</div>
        <div class="repo-arrow"><i class="fas fa-external-link-alt"></i></div>
      </div>
      <div class="repo-description">${escapeHtml(description)}</div>
      <div class="repo-meta">
        <span class="repo-chip"><i class="fas fa-code"></i>${escapeHtml(language)}</span>
        <span class="repo-chip"><i class="fas fa-star"></i>${stars}</span>
        <span class="repo-chip"><i class="fas fa-clock"></i>${escapeHtml(updated)}</span>
      </div>
    </a>
  `;
}

function renderRepos(repos, message = "") {
  repoGrid.innerHTML = repos.map(buildRepoCard).join("");
  repoStatus.textContent = message;
}

async function loadRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repos = await response.json();

    const filtered = repos
      .filter((repo) => !repo.fork)
      .filter((repo) => !EXCLUDED_REPOS.includes(repo.name))
      .slice(0, REPO_LIMIT);

    if (!filtered.length) {
      throw new Error("No repositories returned");
    }

    renderRepos(filtered, "Loaded live from GitHub.");
  } catch (error) {
    console.error("Failed to load live repositories:", error);
    renderRepos(
      fallbackRepos,
      "GitHub could not be reached, so fallback projects are shown."
    );
  }
}

function handleHeaderScroll() {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function setupMobileNav() {
  const setOpen = (open) => {
    navBar.classList.toggle("nav-open", open);
    hamburger?.setAttribute("aria-expanded", String(open));
  };

  hamburger?.addEventListener("click", () => {
    setOpen(!navBar.classList.contains("nav-open"));
  });

  document.addEventListener("click", (event) => {
    if (
      navBar.classList.contains("nav-open") &&
      !navBar.contains(event.target) &&
      !hamburger?.contains(event.target)
    ) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(false);

      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function setupScrollSpy() {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((item) => {
          item.classList.toggle(
            "active",
            item.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function setYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

window.addEventListener("scroll", handleHeaderScroll);

window.addEventListener("DOMContentLoaded", () => {
  handleHeaderScroll();
  setupMobileNav();
  setupScrollSpy();
  setYear();
  loadRepos();
});
