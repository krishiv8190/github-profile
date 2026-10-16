const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = "krishiv8190";

async function fetchGitHubData(endpoint) {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`);

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
