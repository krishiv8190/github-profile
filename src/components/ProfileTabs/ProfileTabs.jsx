import { BookOpen, Code, Package, FolderKanban, Star } from "lucide-react";
import "./ProfileTabs.css";

const tabs = [
  { label: "Overview", icon: BookOpen },
  { label: "Repositories", icon: Code },
  { label: "Projects", icon: FolderKanban },
  { label: "Packages", icon: Package },
  { label: "Stars", icon: Star },
];

const ProfileTabs = ({
  activeTab,
  onTabChange,
  repositoryCount = 0,
  starsCount = 5,
}) => {
  return (
    <nav className="profile-tabs" aria-label="Profile navigation">
      {tabs.map(({ label, icon: Icon }) => (
        <button
          className={`profile-tab ${activeTab === label ? "active" : ""}`}
          type="button"
          key={label}
          onClick={() => onTabChange(label)}
          aria-current={activeTab === label ? "page" : undefined}
        >
          <Icon size={16} strokeWidth={1.8} />
          <span>{label}</span>

          {label === "Repositories" && (
            <span className="tab-count">{repositoryCount}</span>
          )}

          {label === "Stars" && <span className="tab-count">{starsCount}</span>}
        </button>
      ))}
    </nav>
  );
};

export default ProfileTabs;
