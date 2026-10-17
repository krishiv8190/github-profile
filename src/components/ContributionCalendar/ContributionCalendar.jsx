import { useMemo, useState } from "react";
import { GitCommit, GitPullRequest, Sparkles } from "lucide-react";
import useGitHubContributions from "../../hooks/useGitHubContributions";
import "./ContributionCalendar.css";

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from(
  { length: CURRENT_YEAR - 2012 },
  (_, index) => CURRENT_YEAR - index,
);

const CONTRIBUTION_COLORS = [
  "#ebedf0",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

const getContributionColor = (level) =>
  CONTRIBUTION_COLORS[level] ?? CONTRIBUTION_COLORS[0];

const formatMonth = (date) =>
  date.toLocaleDateString("en-US", { month: "short" });

const ContributionCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const { contributions, total, loading, error } =
    useGitHubContributions(selectedYear);

  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions.length) return { weeks: [], monthLabels: [] };

    // The API includes future dates for the current year. GitHub only renders
    // days up to today, so trim those dates before building the grid.
    const today = new Date();
    const visibleContributions = contributions.filter((day) => {
      const date = new Date(`${day.date}T00:00:00`);
      return (
        selectedYear !== CURRENT_YEAR ||
        date <= new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
    });

    if (!visibleContributions.length) return { weeks: [], monthLabels: [] };

    const firstDate = new Date(`${visibleContributions[0].date}T00:00:00`);
    const leadingDays = (firstDate.getDay() + 6) % 7;
    const days = [
      ...Array.from({ length: leadingDays }, () => null),
      ...visibleContributions,
    ];

    while (days.length % 7 !== 0) days.push(null);

    const calendarWeeks = [];
    for (let index = 0; index < days.length; index += 7) {
      calendarWeeks.push(days.slice(index, index + 7));
    }

    const labels = [];
    let previousMonth = -1;

    visibleContributions.forEach((day, dayIndex) => {
      const date = new Date(`${day.date}T00:00:00`);
      const month = date.getMonth();
      if (month !== previousMonth) {
        const weekIndex = Math.floor((leadingDays + dayIndex) / 7);
        labels.push({ index: weekIndex, month, label: formatMonth(date) });
        previousMonth = month;
      }
    });

    return { weeks: calendarWeeks, monthLabels: labels };
  }, [contributions, selectedYear]);

  const hasContributions = weeks.length > 0;

  return (
    <section className="contribution-section">
      <div className="contribution-header">
        <h2>
          {loading
            ? "Loading contributions..."
            : `${total.toLocaleString()} contributions in ${selectedYear}`}
        </h2>
      </div>

      <div className="contribution-body">
        <div className="contribution-card">
          <div className="contribution-calendar-wrapper">
            {error ? (
              <p className="section-message" role="alert">
                Unable to load contributions: {error}
              </p>
            ) : loading ? (
              <p className="section-message">
                Fetching contribution activity...
              </p>
            ) : !hasContributions ? (
              <p className="section-message">
                No contribution data is available for {selectedYear}.
              </p>
            ) : (
              <div className="contribution-calendar-layout">
                <div className="contribution-weekday-labels" aria-hidden="true">
                  <span className="weekday-spacer" />
                  <span>Mon</span>
                  <span className="weekday-spacer" />
                  <span>Wed</span>
                  <span className="weekday-spacer" />
                  <span>Fri</span>
                  <span className="weekday-spacer" />
                </div>

                <div className="contribution-calendar-content">
                  <div
                    className="contribution-months"
                    style={{ "--week-count": weeks.length }}
                    aria-hidden="true"
                  >
                    {monthLabels.map((month) => (
                      <span
                        className="contribution-month"
                        key={`${month.month}-${month.index}`}
                        style={{ gridColumn: month.index + 1 }}
                      >
                        {month.label}
                      </span>
                    ))}
                  </div>

                  <div
                    className="contribution-calendar"
                    style={{ "--week-count": weeks.length }}
                    role="group"
                    aria-label={`Daily contributions in ${selectedYear}`}
                  >
                    {weeks.map((week, weekIndex) => (
                      <div className="contribution-week" key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <div
                            key={day?.date ?? `empty-${weekIndex}-${dayIndex}`}
                            className="contribution-day"
                            style={{
                              backgroundColor: day
                                ? getContributionColor(day.level)
                                : "transparent",
                            }}
                            title={
                              day
                                ? `${day.count} contributions on ${day.date}`
                                : undefined
                            }
                            aria-label={
                              day
                                ? `${day.count} contributions on ${day.date}`
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && hasContributions && (
              <div className="contribution-calendar-footer">
                <a
                  href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn how we count contributions
                </a>
                <div
                  className="contribution-legend"
                  aria-label="Contribution levels"
                >
                  <span>Less</span>
                  {CONTRIBUTION_COLORS.map((color, index) => (
                    <span
                      key={color}
                      className="contribution-legend-square"
                      style={{ backgroundColor: color }}
                      aria-label={`Contribution level ${index}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            )}
          </div>

          <div className="activity-overview">
            <div className="activity-overview-copy">
              <h3>Activity overview</h3>
              <div className="activity-org-tags">
                <a
                  href="https://github.com/UptimeAI"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="org-tag-icon">✿</span> @UptimeAI
                </a>
                <a
                  href="https://github.com/timescale"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="org-tag-icon timescale">◉</span> @timescale
                </a>
              </div>
              <p className="activity-summary">
                <GitCommit size={15} aria-hidden="true" />
                <span>
                  Contributed to{" "}
                  <a
                    href="https://github.com/UptimeAI/uptime_webapp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    UptimeAI/uptime_webapp
                  </a>
                  ,{" "}
                  <a
                    href="https://github.com/UptimeAI/uptime_server"
                    target="_blank"
                    rel="noreferrer"
                  >
                    UptimeAI/uptime_server
                  </a>
                  ,{" "}
                  <a
                    href="https://github.com/UptimeAI/uptime_ml"
                    target="_blank"
                    rel="noreferrer"
                  >
                    UptimeAI/uptime_ml
                  </a>
                  , and 13 other repositories
                </span>
              </p>
            </div>

            <div
              className="activity-chart"
              aria-label="Contribution activity distribution"
            >
              <span className="chart-label chart-label-top">Code review</span>
              <span className="chart-label chart-label-right">Issues</span>
              <span className="chart-label chart-label-left">
                83%
                <br />
                Commits
              </span>
              <span className="chart-label chart-label-bottom">
                17%
                <br />
                Pull requests
              </span>
              <svg
                viewBox="0 0 240 220"
                role="img"
                aria-label="Commit, pull request, issue and code review activity"
              >
                <line
                  x1="120"
                  y1="22"
                  x2="120"
                  y2="192"
                  className="chart-axis"
                />
                <line
                  x1="26"
                  y1="110"
                  x2="214"
                  y2="110"
                  className="chart-axis"
                />
                <polygon
                  points="26,110 120,110 120,136"
                  className="chart-area"
                />
                <circle cx="26" cy="110" r="3.5" className="chart-point" />
                <circle cx="120" cy="136" r="3.5" className="chart-point" />
              </svg>
            </div>
          </div>
        </div>

        <nav
          className="contribution-year-selector"
          aria-label="Contribution year"
        >
          {AVAILABLE_YEARS.map((year) => (
            <button
              key={year}
              type="button"
              className={selectedYear === year ? "active" : ""}
              aria-pressed={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </nav>
      </div>

      <section
        className="contribution-activity"
        aria-labelledby="contribution-activity-title"
      >
        <h2 id="contribution-activity-title">Contribution activity</h2>
        <div className="activity-month-heading">
          <strong>October 2025</strong>
          <span />
        </div>
        <div className="activity-timeline">
          <div className="timeline-icon">
            <GitCommit size={17} aria-hidden="true" />
          </div>
          <div className="timeline-content">
            <p>
              <span>
                Created <strong>56 commits</strong> in 11 repositories
              </span>
              <time>Oct 1 – Oct 31</time>
            </p>
          </div>
          <div className="timeline-decoration" />
        </div>
        <div className="activity-timeline pull-request-timeline">
          <div className="timeline-icon">
            <GitPullRequest size={17} aria-hidden="true" />
          </div>
          <div className="timeline-content">
            <p>
              <span>
                Opened <strong>29 pull requests</strong> in 5 repositories
              </span>
              <time>Oct 1 – Oct 31</time>
            </p>
            <ul className="activity-repository-list">
              <li>
                <a href="https://github.com/UptimeAI/uptime_webapp">
                  UptimeAI/uptime_webapp
                </a>
                <span className="merged-count">16 merged</span>
                <span className="open-count">1 open</span>
              </li>
              <li>
                <a href="https://github.com/UptimeAI/uptime_ml">
                  UptimeAI/uptime_ml
                </a>
                <span className="merged-count">6 merged</span>
              </li>
              <li>
                <a href="https://github.com/UptimeAI/uptime_scripts">
                  UptimeAI/uptime_scripts
                </a>
                <span className="merged-count">4 merged</span>
              </li>
              <li>
                <a href="https://github.com/UptimeAI/uptime_engine">
                  UptimeAI/uptime_engine
                </a>
                <span className="merged-count">1 merged</span>
              </li>
              <li>
                <a href="https://github.com/UptimeAI/uptime_ml_encrypted">
                  UptimeAI/uptime_ml_encrypted
                </a>
                <span className="merged-count">1 merged</span>
              </li>
            </ul>
          </div>
          <div className="timeline-decoration" />
        </div>
        <button
          className="show-more-activity"
          type="button"
          onClick={(event) => event.currentTarget.classList.toggle("expanded")}
        >
          <span>Show more activity</span>
          <Sparkles size={14} aria-hidden="true" />
        </button>
      </section>
    </section>
  );
};

export default ContributionCalendar;
