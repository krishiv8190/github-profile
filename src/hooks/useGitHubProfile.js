import { useEffect, useState } from "react";
import { getGitHubProfile } from "../services/githubApi";

export function useGitHubProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      try {
        const data = await getGitHubProfile();

        if (isActive) {
          setProfile(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return { profile, loading, error };
}
