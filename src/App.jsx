import { useState } from "react";
import Header from "./components/Header";
import ProfileTabs from "./components/ProfileTabs";
import ProfileSidebar from "./components/ProfileSidebar";
import RepositorySection from "./components/RepositorySection";
import { useGitHubProfile } from "./hooks/useGitHubProfile";
import useGitHubRepositories from "./hooks/useGitHubRepositories";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useGitHubProfile();

  const {
    repositories,
    loading: repositoriesLoading,
    error: repositoriesError,
  } = useGitHubRepositories();

  return (
    <div className="app">
      <Header />

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        repositoryCount={profile?.public_repos ?? 0}
      />

      <main className="page-layout">
        {profileLoading ? (
          <aside className="profile-sidebar">
            <p className="section-message">Loading profile...</p>
          </aside>
        ) : profileError ? (
          <aside className="profile-sidebar">
            <p className="section-message" role="alert">
              Unable to load GitHub profile.
            </p>
          </aside>
        ) : (
          <ProfileSidebar profile={profile} />
        )}

        <div className="main-content">
          {activeTab === "Overview" && (
            <>
              <RepositorySection
                repositories={repositories}
                loading={repositoriesLoading}
                error={repositoriesError}
              />

              <section className="contribution-section">
                <h2>Contribution activity</h2>
                <p className="section-message">
                  Contribution calendar coming next.
                </p>
              </section>
            </>
          )}

          {activeTab === "Repositories" && (
            <RepositorySection
              repositories={repositories}
              loading={repositoriesLoading}
              error={repositoriesError}
            />
          )}

          {["Projects", "Packages", "Stars"].includes(activeTab) && (
            <section className="empty-section">
              <h2>{activeTab}</h2>
              <p className="section-message">Nothing to display here yet.</p>
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <span>GitHub profile recreation</span>
        <a href="https://docs.github.com">Docs</a>
        <a href="https://support.github.com">GitHub Docs</a>
      </footer>
    </div>
  );
};

export default App;
