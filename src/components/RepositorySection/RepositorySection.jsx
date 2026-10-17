import RepositoryCard from "../RepositoryCard/RepositoryCard";
import "./RepositorySection.css";

const PINNED_REPOSITORY_NAMES = [
  "Complete-Python-3-Bootcamp",
  "flutter_login_ui",
  "gitignore",
  "node-opcua-logger",
  "kafkajs",
  "node-opcua-1",
];

const RepositorySection = ({ repositories = [], loading, error }) => {
  if (loading) {
    return (
      <section className="repository-section">
        <div className="section-heading">
          <h2>Popular repositories</h2>
          <a
            className="subtle-link"
            href="https://github.com/shreeramk?tab=repositories"
          >
            Customize your pins
          </a>
        </div>
        <p className="section-message">Loading repositories...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="repository-section">
        <h2>Popular repositories</h2>
        <p className="section-message" role="alert">
          Unable to load repositories. Please try again later.
        </p>
      </section>
    );
  }

  const repositoriesByName = new Map(
    repositories.map((repository) => [repository.name, repository]),
  );

  const pinnedRepositories = PINNED_REPOSITORY_NAMES.map((name) =>
    repositoriesByName.get(name),
  ).filter(Boolean);

  const pinnedNames = new Set(PINNED_REPOSITORY_NAMES);

  const remainingRepositories = repositories.filter(
    (repository) => !pinnedNames.has(repository.name),
  );

  const selectedRepositories = [
    ...pinnedRepositories,
    ...remainingRepositories,
  ].slice(0, 6);
  console.table(
    selectedRepositories.map(({ name, language, fork, parent }) => ({
      name,
      language,
      fork,
      parent: parent?.full_name,
    })),
  );
  return (
    <section className="repository-section">
      <div className="section-heading">
        <h2>Popular repositories</h2>
        <a
          className="subtle-link"
          href="https://github.com/shreeramk?tab=repositories"
        >
          Customize your pins
        </a>
      </div>

      {selectedRepositories.length === 0 ? (
        <p className="section-message">No public repositories found.</p>
      ) : (
        <div className="repository-grid">
          {selectedRepositories.map((repository) => (
            <RepositoryCard key={repository.id} repository={repository} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RepositorySection;
