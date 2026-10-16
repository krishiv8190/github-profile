import RepositoryCard from "../RepositoryCard/RepositoryCard";
import "./RepositorySection.css";

const RepositorySection = ({ repositories, loading, error }) => {
  if (loading) {
    return (
      <section className="repository-section">
        <h2>Popular repositories</h2>
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

  const popularRepositories = repositories.slice(0, 6);

  return (
    <section className="repository-section">
      <div className="section-heading">
        <h2>Popular repositories</h2>
      </div>

      {popularRepositories.length === 0 ? (
        <p className="section-message">No public repositories found.</p>
      ) : (
        <div className="repository-grid">
          {popularRepositories.map((repository) => (
            <RepositoryCard key={repository.id} repository={repository} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RepositorySection;
