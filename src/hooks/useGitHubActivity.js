import { useEffect, useState } from "react";
import { getGitHubPublicEvents } from "../services/githubApi";

const useGitHubActivity = () => {
  const [activity, setActivity] = useState({
    repositories: [],
    counts: {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      reviews: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivity = async () => {
      setLoading(true);
      setError(null);

      try {
        const events = await getGitHubPublicEvents(controller.signal);

        if (controller.signal.aborted) return;

        const repositories = new Map();
        const counts = {
          commits: 0,
          pullRequests: 0,
          issues: 0,
          reviews: 0,
        };

        events.forEach((event) => {
          const repoName = event.repo?.name;

          if (repoName) {
            repositories.set(repoName, (repositories.get(repoName) ?? 0) + 1);
          }

          switch (event.type) {
            case "PushEvent":
              counts.commits += event.payload?.commits?.length ?? 0;
              break;
            case "PullRequestEvent":
              counts.pullRequests += 1;
              break;
            case "IssuesEvent":
              counts.issues += 1;
              break;
            case "PullRequestReviewEvent":
            case "PullRequestReviewCommentEvent":
              counts.reviews += 1;
              break;
            default:
              break;
          }
        });

        setActivity({
          repositories: [...repositories.entries()]
            .map(([name, eventCount]) => ({ name, eventCount }))
            .sort((a, b) => b.eventCount - a.eventCount),
          counts,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load GitHub activity.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadActivity();

    return () => controller.abort();
  }, []);

  return { ...activity, loading, error };
};

export default useGitHubActivity;
