import { useEffect, useState } from "react";
import { getGitHubRepositories } from "../services/githubApi";

const useGitHubRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadRepositories = async () => {
      try {
        const data = await getGitHubRepositories();

        if (!controller.signal.aborted) {
          setRepositories(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadRepositories();

    return () => controller.abort();
  }, []);

  return { repositories, loading, error };
};

export default useGitHubRepositories;
