import "./RepositoryCard.css";

const RepositoryCard = ({ repository }) => {
  const {
    name,
    description,
    html_url,
    language,
    stargazers_count,
    fork,
    private: isPrivate,
    forks_count,
    parent,
    source,
  } = repository;

  const forkSource = parent || source;

  return (
    <article className="repository-card">
      <div className="repository-title-row">
        <a
          className="repository-name"
          href={html_url}
          target="_blank"
          rel="noreferrer"
        >
          {name}
        </a>

        <span className="visibility-label">
          {isPrivate ? "Private" : "Public"}
        </span>
      </div>

      {fork && forkSource && (
        <p className="repository-fork-source">
          Forked from{" "}
          <a href={forkSource.html_url} target="_blank" rel="noreferrer">
            {forkSource.full_name}
          </a>
        </p>
      )}

      {description && <p className="repository-description">{description}</p>}

      <div className="repository-meta">
        {language && (
          <span className="repository-language">
            <span
              className={`language-dot language-${language
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`}
              aria-hidden="true"
            />
            {language}
          </span>
        )}

        {stargazers_count > 0 && (
          <span className="repository-stars">
            <span aria-hidden="true">★</span> {stargazers_count}
          </span>
        )}

        {fork && !forkSource && <span className="repository-fork">Fork</span>}
        {forks_count > 0 && (
          <span className="repository-forks">
            <span aria-hidden="true">⑂</span> {forks_count}
          </span>
        )}
      </div>
    </article>
  );
};

export default RepositoryCard;
