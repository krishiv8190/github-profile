import { useEffect, useState } from "react";
import { getGitHubContributions } from "../services/githubApi";

const useGitHubContributions = (year) => {
  const [contributions, setContributions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadContributions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getGitHubContributions(year, controller.signal);

        if (controller.signal.aborted) return;

        setContributions(data.contributions ?? []);
        setTotal(
          data.total?.[year] ??
            data.total?.[String(year)] ??
            data.total?.lastYear ??
            data.contributions.reduce((sum, day) => sum + day.count, 0),
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Something went wrong");
          setContributions([]);
          setTotal(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadContributions();

    return () => controller.abort();
  }, [year]);

  return { contributions, total, loading, error };
};

export default useGitHubContributions;
