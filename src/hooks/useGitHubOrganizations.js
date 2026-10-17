import { useEffect, useState } from "react";
import { getGitHubOrganizations } from "../services/githubApi";

const useGitHubOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOrganizations = async () => {
      try {
        const data = await getGitHubOrganizations(controller.signal);
        setOrganizations(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadOrganizations();

    return () => controller.abort();
  }, []);

  return { organizations, loading, error };
};

export default useGitHubOrganizations;
