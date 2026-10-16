import {
  Bell,
  Plus,
  Search,
  Menu,
  CircleDot,
  GitPullRequest,
  BookMarked,
  Bot,
  Command,
} from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-left">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label="Open navigation menu"
        >
          <Menu size={16} />
        </button>

        <a
          className="github-mark"
          href="https://github.com"
          aria-label="GitHub home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.31-3.76-1.31-.5-1.28-1.25-1.62-1.25-1.62-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.94.1-.73.4-1.22.71-1.5-2.48-.29-5.1-1.24-5.1-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.06 1.14a10.6 10.6 0 0 1 5.57 0c2.12-1.44 3.06-1.14 3.06-1.14.61 1.53.23 2.67.12 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.63 5.23-5.12 5.5.4.35.76 1.03.76 2.08V22c0 .3.2.64.77.53A11.1 11.1 0 0 0 12 .9Z"
            />
          </svg>
        </a>

        <strong className="header-username">shreeramk</strong>
      </div>

      <div className="header-actions">
        <div className="header-search-group">
          <button
            className="search-control"
            type="button"
            aria-label="Search GitHub"
          >
            <Search size={16} />
            <span>
              Type <kbd>/</kbd> to search
            </span>
          </button>

          <button
            className="icon-button command-button"
            type="button"
            aria-label="Command palette"
          >
            <Command size={16} />
          </button>
        </div>

        <button
          className="icon-button optional-header-action"
          type="button"
          aria-label="Copilot"
        >
          <Bot size={16} />
        </button>

        <button
          className="icon-button create-button"
          type="button"
          aria-label="Create new"
        >
          <Plus size={16} />
          <span className="dropdown-indicator">⌄</span>
        </button>

        <button
          className="icon-button optional-header-action"
          type="button"
          aria-label="Issues"
        >
          <CircleDot size={16} />
        </button>

        <button
          className="icon-button optional-header-action"
          type="button"
          aria-label="Pull requests"
        >
          <GitPullRequest size={16} />
        </button>

        <button
          className="icon-button optional-header-action"
          type="button"
          aria-label="Repositories"
        >
          <BookMarked size={16} />
        </button>

        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>

        <img
          className="header-avatar"
          src="https://avatars.githubusercontent.com/u/47680902?v=4"
          alt="GitHub account avatar"
        />
      </div>
    </header>
  );
};

export default Header;
