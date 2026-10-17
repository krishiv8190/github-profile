import { BookOpen, BookMarked, Table2, Package, Star } from "lucide-react";
import "./ProfileTabs.css";

const tabs = [
  { label: "Overview", icon: BookOpen, key: "overview" },
  { label: "Repositories", icon: BookMarked, key: "repositories" },
  { label: "Projects", icon: Table2, key: "projects" },
  { label: "Packages", icon: Package, key: "packages" },
  { label: "Stars", icon: Star, key: "stars" },
];

const ProfileTabs = ({
  activeTab,
  onTabChange,
  repositoryCount = 0,
  starsCount = 5,
}) => {
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
                onClick={() => onTabChange(label)}
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
