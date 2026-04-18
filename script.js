const GITHUB_USERNAME = "joachimth";
const REPO_LIMIT = 5;
const EXCLUDED_REPOS = ["Portfolio"];

const repoGrid = document.getElementById("repoGrid");
const repoStatus = document.getElementById("repoStatus");
const header = document.querySelector(".site-header");
const hamburger = document.getElementById("hamburger");
const navBar = document.getElementById("navBar");
const navLinks = document.querySelectorAll(".nav-link");

const fallbackRepos = [
  {
    name: "El-tilbudsberegner",
    html_url: "https://github.com/joachimth/El-tilbudsberegner",
    description: "Fast quote calculator concept for electricians.",
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2026-01-24T22:07:31Z"
  },
  {
    name: "SI5351-TCXO-Radio",
    html_url: "https://github.com/joachimth/SI5351-TCXO-Radio",
    description: "Radio project based on stable clock generation and RF experimentation.",
    language: "C++",
    stargazers_count: 0,
    updated_at: "2026-03-28T12:32:37Z"
  },
  {
    name: "lyd-lab",
    html_url: "https://github.com/joachimth/lyd-lab",
    description: "Audio lab experiments and sound-related practical projects.",
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2026-01-25T18:13:35Z"
  },
  {
    name: "intercept",
    html_url: "https://github.com/joachimth/intercept",
    description: "Hands-on technical project centered on hardware and embedded work.",
    language: "C++",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z"
  },
  {
    name: "adsb-feeder-image",
    html_url: "https://github.com/joachimth/adsb-feeder-image",
    description: "Tooling related to ADS-B feeder deployment and image-based setup.",
    language: "Dockerfile",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z"
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
        <div class="repo-arrow"><i class="fas fa-arrow-up-right-from-square"></i></div>
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
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
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
  hamburger?.addEventListener("click", () => {
    navBar.classList.toggle("nav-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navBar.classList.remove("nav-open");

      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
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
  setYear();
  loadRepos();
});