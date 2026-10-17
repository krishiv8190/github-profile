const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = "shreeramk";
const CONTRIBUTIONS_API_URL = "https://github-contributions-api.jogruber.de/v4";

async function fetchGitHubData(endpoint, signal) {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, { signal });

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

export async function getGitHubRepositories(signal) {
  const repositories = await fetchGitHubData(
    `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
    signal,
  );

  return Promise.all(
    repositories.map(async (repository) => {
      if (!repository.fork) {
        return repository;
      }

      try {
        const details = await fetchGitHubData(
          `/repos/${GITHUB_USERNAME}/${repository.name}`,
          signal,
        );

        const parent = details.parent ?? repository.parent ?? null;
        const source = details.source ?? repository.source ?? null;

        return {
          ...repository,
          parent,
          source,
          language:
            repository.language ?? parent?.language ?? source?.language ?? null,
        };
      } catch {
        return repository;
      }
    }),
  );
}

export function getGitHubOrganizations(signal) {
  return fetchGitHubData(`/users/${GITHUB_USERNAME}/orgs`, signal);
}

export async function getGitHubContributions(year, signal) {
  const response = await fetch(
    `${CONTRIBUTIONS_API_URL}/${GITHUB_USERNAME}?y=${year}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Contributions request failed: ${response.status}`);
  }

  return response.json();
}

export function getGitHubPublicEvents(signal) {
  return fetchGitHubData(
    `/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    signal,
  );
}
