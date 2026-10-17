import { useState } from "react";
import Header from "./components/Header/Header";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import RepositorySection from "./components/RepositorySection/RepositorySection";
import ContributionCalendar from "./components/ContributionCalendar/ContributionCalendar";
import { useGitHubProfile } from "./hooks/useGitHubProfile";
import useGitHubRepositories from "./hooks/useGitHubRepositories";
import useGitHubOrganizations from "./hooks/useGitHubOrganizations";
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

  const {
    organizations,
    loading: organizationsLoading,
    error: organizationsError,
  } = useGitHubOrganizations();

  return (
    <div className="app">
      <Header avatarUrl={profile?.avatar_url} />

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
          <ProfileSidebar
            profile={profile}
            organizations={organizations}
            organizationsLoading={organizationsLoading}
            organizationsError={organizationsError}
          />
        )}

        <div className="main-content">
          {activeTab === "Overview" && (
            <>
              <RepositorySection
                repositories={repositories}
                loading={repositoriesLoading}
                error={repositoriesError}
              />
              <ContributionCalendar />
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
        <span className="footer-brand">
          <span aria-hidden="true">●</span> © {new Date().getFullYear()} GitHub,
          Inc.
        </span>
        <a href="https://github.com">Terms</a>
        <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement">
          Privacy
        </a>
        <a href="https://docs.github.com">Docs</a>
        <a href="https://support.github.com">Contact</a>
        <a href="https://github.com">Manage cookies</a>
      </footer>
    </div>
  );
};

export default App;
