import RepositoryCard from "./RepositoryCard";

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

  return (
    <section className="repository-section">
      <div className="section-heading">
        <h2>Popular repositories</h2>
      </div>

      {repositories.length === 0 ? (
        <p className="section-message">No public repositories found.</p>
      ) : (
        <div className="repository-grid">
          {repositories.map((repository) => (
            <RepositoryCard key={repository.id} repository={repository} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RepositorySection;
