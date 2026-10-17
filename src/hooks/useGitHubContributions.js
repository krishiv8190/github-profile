import { useEffect, useState } from "react";
import { getGitHubContributions } from "../services/githubApi";

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getRollingYearStart = (today) => {
  const start = new Date(today);
  start.setDate(start.getDate() - 370);
  return getLocalDateString(start);
};

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
        const currentYear = new Date().getFullYear();
        let dailyContributions;

        if (year === currentYear) {
          const [previousData, currentData] = await Promise.all([
            getGitHubContributions(year - 1, controller.signal),
            getGitHubContributions(year, controller.signal),
          ]);

          dailyContributions = [
            ...(previousData.contributions ?? []),
            ...(currentData.contributions ?? []),
          ];
        } else {
          const data = await getGitHubContributions(year, controller.signal);

          dailyContributions = data.contributions ?? [];
        }

        if (controller.signal.aborted) return;

        const today = new Date();
        const todayString = getLocalDateString(today);

        // Heatmap range: rolling 12 months for the current year,
        // full calendar year for previously selected years.
        const heatmapStart =
          year === currentYear ? getRollingYearStart(today) : `${year}-01-01`;

        const heatmapEnd = year === currentYear ? todayString : `${year}-12-31`;

        const visibleContributions = dailyContributions
          .filter((day) => day.date >= heatmapStart && day.date <= heatmapEnd)
          .sort((a, b) => a.date.localeCompare(b.date));

        // Heading total: selected calendar year only.
        const yearStart = `${year}-01-01`;
        const yearEnd = year === currentYear ? todayString : `${year}-12-31`;

        const totalContributions = dailyContributions
          .filter((day) => day.date >= yearStart && day.date <= yearEnd)
          .reduce((sum, day) => sum + (day.count ?? 0), 0);

        setContributions(visibleContributions);
        setTotal(totalContributions);
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
