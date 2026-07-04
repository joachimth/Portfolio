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
    name: "mk3-reference-loudspeaker",
    html_url: "https://github.com/joachimth/mk3-reference-loudspeaker",
    description: "Reference loudspeaker design project – MK3 revision.",
    language: "Python",
    stargazers_count: 1,
    updated_at: "2026-07-04T19:18:03Z"
  },
  {
    name: "speaker-design",
    html_url: "https://github.com/joachimth/speaker-design",
    description: "Speaker cabinet and crossover design tool.",
    language: "TypeScript",
    stargazers_count: 1,
    updated_at: "2026-07-04T18:11:50Z"
  },
  {
    name: "SI5351-TCXO-Radio",
    html_url: "https://github.com/joachimth/SI5351-TCXO-Radio",
    description: "Hardware for an AM Airband Receiver.",
    language: "C++",
    stargazers_count: 1,
    updated_at: "2026-06-23T11:51:59Z"
  },
  {
    name: "El-tilbudsberegner",
    html_url: "https://github.com/joachimth/El-tilbudsberegner",
    description: "Quote calculator tool for electricians.",
    language: "TypeScript",
    stargazers_count: 1,
    updated_at: "2026-06-12T08:49:29Z"
  },
  {
    name: "track-robot-v2",
    html_url: "https://github.com/joachimth/track-robot-v2",
    description: "Web Flasher for an ESP32-based tracked robot platform.",
    language: "C",
    stargazers_count: 1,
    updated_at: "2026-06-12T08:48:12Z"
  },
  {
    name: "speedometer-app",
    html_url: "https://github.com/joachimth/speedometer-app",
    description: "GPS-based speedometer application.",
    language: "JavaScript",
    stargazers_count: 1,
    updated_at: "2026-06-12T08:47:36Z"
  },
  {
    name: "adsb-planes-mil",
    html_url: "https://github.com/joachimth/adsb-planes-mil",
    description: "ADSB tracker page for EU military aircraft.",
    language: "JavaScript",
    stargazers_count: 1,
    updated_at: "2026-06-12T08:47:36Z"
  },
  {
    name: "storybook",
    html_url: "https://github.com/joachimth/storybook",
    description: "Storybook and narrative experiments.",
    language: "Python",
    stargazers_count: 0,
    updated_at: "2026-06-12T08:47:36Z"
  },
  {
    name: "esp32-ecu-reversing-for-speeduino",
    html_url: "https://github.com/joachimth/esp32-ecu-reversing-for-speeduino",
    description: "ESP32 ECU reverse-engineering work targeting Speeduino compatibility.",
    language: "C++",
    stargazers_count: 1,
    updated_at: "2026-06-05T05:38:58Z"
  },
  {
    name: "keydatabaseforthefun",
    html_url: "https://github.com/joachimth/keydatabaseforthefun",
    description: "Key database utility project.",
    language: "Python",
    stargazers_count: 1,
    updated_at: "2026-06-01T04:48:27Z"
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
