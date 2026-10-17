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

const RepositoryCardSkeleton = () => (
  <div className="repository-skeleton" aria-hidden="true">
    <div className="repository-skeleton-heading">
      <span className="skeleton repository-skeleton-icon" />
      <span className="skeleton repository-skeleton-name" />
    </div>

    <span className="skeleton repository-skeleton-description" />
    <span className="skeleton repository-skeleton-description repository-skeleton-description-short" />

    <div className="repository-skeleton-footer">
      <span className="skeleton repository-skeleton-language-dot" />
      <span className="skeleton repository-skeleton-language" />
      <span className="skeleton repository-skeleton-meta" />
    </div>
  </div>
);

const RepositorySection = ({ repositories = [], loading, error }) => {
  if (loading) {
    return (
      <section className="repository-section" aria-busy="true">
        <div className="section-heading">
          <h2>Popular repositories</h2>
          <span className="subtle-link">Customize your pins</span>
        </div>

        <div className="repository-grid repository-grid-skeleton">
          {Array.from({ length: 6 }, (_, index) => (
            <RepositoryCardSkeleton key={index} />
          ))}
        </div>

        <span className="sr-only" role="status">
          Loading repositories...
        </span>
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
