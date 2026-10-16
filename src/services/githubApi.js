const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = "shreeramk";
const CONTRIBUTIONS_API_URL = "https://github-contributions-api.jogruber.de/v4";

async function fetchGitHubData(endpoint, signal) {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function getGitHubProfile() {
  return fetchGitHubData(`/users/${GITHUB_USERNAME}`);
}

export function getGitHubRepositories() {
  return fetchGitHubData(
    `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner`,
  );
}

export async function getGitHubContributions(year, signal) {
  const response = await fetch(
    `${CONTRIBUTIONS_API_URL}/${GITHUB_USERNAME}?y=${year}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Contributions request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
