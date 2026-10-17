import { BookOpen, BookMarked, Table2, Package, Star } from "lucide-react";
import "./ProfileTabs.css";

const GITHUB_PROFILE_URL = "https://github.com/shreeramk";

const tabs = [
  { label: "Overview", icon: BookOpen, key: "overview" },
  { label: "Repositories", icon: BookMarked, key: "repositories" },
  { label: "Projects", icon: Table2, key: "projects" },
  { label: "Packages", icon: Package, key: "packages" },
  { label: "Stars", icon: Star, key: "stars" },
];

const tabUrls = {
  repositories: `${GITHUB_PROFILE_URL}?tab=repositories`,
  projects: `${GITHUB_PROFILE_URL}?tab=projects`,
  packages: `${GITHUB_PROFILE_URL}?tab=packages`,
  stars: `${GITHUB_PROFILE_URL}?tab=stars`,
};

const ProfileTabs = ({
  activeTab,
  onTabChange,
  repositoryCount = 0,
  starsCount = 5,
}) => {
  const handleTabClick = (label, key) => {
    if (key === "overview") {
      onTabChange(label);
      return;
    }

    window.location.href = tabUrls[key];
  };

  return (
    <nav className="profile-tabs" aria-label="User">
      <ul className="profile-tabs-list">
        {tabs.map(({ label, icon: Icon, key }) => {
          const isActive = activeTab === label;

          return (
            <li className="profile-tabs-item" key={key}>
              <button
                className={`profile-tab${isActive ? " active" : ""}`}
                type="button"
                onClick={() => handleTabClick(label, key)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className="profile-tab-icon"
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span className="profile-tab-label">{label}</span>

                {key === "repositories" && (
                  <span className="tab-count">{repositoryCount}</span>
                )}

                {key === "stars" && (
                  <span className="tab-count">{starsCount}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ProfileTabs;
