const RepositoryCard = ({ repository }) => {
  const { name, description, html_url, language, stargazers_count, fork } =
    repository;

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
          {repository.private ? "Private" : "Public"}
        </span>
      </div>

      {description && <p className="repository-description">{description}</p>}

      <div className="repository-meta">
        {language && (
          <span className="repository-language">
            <span className="language-dot" aria-hidden="true" />
            {language}
          </span>
        )}

        {stargazers_count > 0 && (
          <span className="repository-stars">
            <span aria-hidden="true">★</span> {stargazers_count}
          </span>
        )}

        {fork && <span className="repository-fork">Fork</span>}
      </div>
    </article>
  );
};

export default RepositoryCard;
