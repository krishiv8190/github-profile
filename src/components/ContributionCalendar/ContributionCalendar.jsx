import { useEffect, useMemo, useState } from "react";
import { GitCommit, GitPullRequest, Sparkles } from "lucide-react";
import useGitHubContributions from "../../hooks/useGitHubContributions";
import useGitHubActivity from "../../hooks/useGitHubActivity";
import { getGitHubOrganizations } from "../../services/githubApi";
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

const formatChartDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const chartEndDate = new Date();
const chartStartDate = new Date(chartEndDate);
chartStartDate.setDate(chartStartDate.getDate() - 370);

const activityChartDescription = `A graph representing shreeramk's contributions from ${formatChartDate(
  chartStartDate,
)} to ${formatChartDate(
  chartEndDate,
)}. The contributions are 78% commits, 22% pull requests, 0% code review, 0% issues.`;

const formatContributionDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${date.toLocaleDateString("en-US", { month: "long" })} ${day}${suffix}`;
};

const getTooltipPosition = (element) => {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
  };
};

const ContributionCalendarSkeleton = () => (
  <div
    className="contribution-loading-skeleton"
    role="status"
    aria-label="Loading contribution calendar"
    aria-busy="true"
  >
    <span className="sr-only">Loading contribution calendar...</span>
    <div className="contribution-calendar-layout" aria-hidden="true">
      <div className="contribution-weekday-labels contribution-skeleton-weekdays">
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            className="skeleton contribution-skeleton-weekday"
          />
        ))}
      </div>
      <div className="contribution-calendar-content">
        <div className="contribution-months contribution-skeleton-months">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              className="skeleton contribution-skeleton-month"
            />
          ))}
        </div>
        <div className="contribution-calendar contribution-skeleton-grid">
          {Array.from({ length: 53 }, (_, weekIndex) => (
            <div className="contribution-week" key={weekIndex}>
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <span
                  className="skeleton contribution-day contribution-skeleton-day"
                  key={dayIndex}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="contribution-calendar-footer contribution-skeleton-footer">
          <span className="skeleton contribution-skeleton-link" />
          <span className="skeleton contribution-skeleton-legend" />
        </div>
      </div>
    </div>
  </div>
);

const ContributionCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [organizations, setOrganizations] = useState([]);
  const [organizationsError, setOrganizationsError] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const { contributions, total, loading, error } =
    useGitHubContributions(selectedYear);

  useGitHubActivity();

  useEffect(() => {
    const controller = new AbortController();

    const loadOrganizations = async () => {
      try {
        const data = await getGitHubOrganizations(controller.signal);

        if (!controller.signal.aborted) {
          setOrganizations(data);
          setOrganizationsError(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setOrganizationsError(true);
        }
      }
    };

    loadOrganizations();

    return () => controller.abort();
  }, []);

  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions.length) {
      return { weeks: [], monthLabels: [] };
    }

    const today = new Date();

    const visibleContributions = contributions.filter((day) => {
      const date = new Date(`${day.date}T00:00:00`);

      return (
        selectedYear !== CURRENT_YEAR ||
        date <= new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
    });

    if (!visibleContributions.length) {
      return { weeks: [], monthLabels: [] };
    }

    const firstDate = new Date(`${visibleContributions[0].date}T00:00:00`);
    const leadingDays = firstDate.getDay();

    const days = [
      ...Array.from({ length: leadingDays }, () => null),
      ...visibleContributions,
    ];

    while (days.length % 7 !== 0) {
      days.push(null);
    }

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

        labels.push({
          index: weekIndex,
          month,
          label: formatMonth(date),
        });

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
          {loading ? (
            <span
              className="skeleton contribution-heading-skeleton"
              aria-label="Loading contribution total"
            />
          ) : (
            `${total.toLocaleString()} contributions in ${selectedYear}`
          )}
        </h2>
      </div>

      <div className="contribution-body">
        <div className="contribution-main-column">
          <div className="contribution-card">
            <div className="contribution-calendar-wrapper">
              {error ? (
                <p className="section-message" role="alert">
                  Unable to load contributions: {error}
                </p>
              ) : loading ? (
                <ContributionCalendarSkeleton />
              ) : !hasContributions ? (
                <p className="section-message">
                  No contribution data is available for {selectedYear}.
                </p>
              ) : (
                <div className="contribution-calendar-layout">
                  <div
                    className="contribution-weekday-labels"
                    aria-hidden="true"
                  >
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
                              key={
                                day?.date ?? `empty-${weekIndex}-${dayIndex}`
                              }
                              className="contribution-day"
                              style={{
                                backgroundColor: day
                                  ? getContributionColor(day.level)
                                  : "transparent",
                              }}
                              tabIndex={day ? 0 : undefined}
                              role={day ? "img" : undefined}
                              aria-label={
                                day
                                  ? `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${formatContributionDate(day.date)}`
                                  : undefined
                              }
                              onMouseEnter={(event) => {
                                if (!day) return;
                                setActiveTooltip({
                                  text: `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${formatContributionDate(day.date)}`,
                                  ...getTooltipPosition(event.currentTarget),
                                });
                              }}
                              onMouseLeave={() => setActiveTooltip(null)}
                              onFocus={(event) => {
                                if (!day) return;
                                setActiveTooltip({
                                  text: `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${formatContributionDate(day.date)}`,
                                  ...getTooltipPosition(event.currentTarget),
                                });
                              }}
                              onBlur={() => setActiveTooltip(null)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

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
                  78%
                  <br />
                  Commits
                </span>
                <span className="chart-label chart-label-bottom">
                  22%
                  <br />
                  Pull requests
                </span>

                <svg
                  viewBox="0 0 240 240"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="78 percent commits and 22 percent pull requests"
                  title={activityChartDescription}
                >
                  <title>{activityChartDescription}</title>
                  <line
                    x1="120"
                    y1="8"
                    x2="120"
                    y2="212"
                    className="chart-axis"
                  />
                  <line
                    x1="8"
                    y1="110"
                    x2="232"
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
                <GitCommit size={15} aria-hidden="true" />
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
                <GitPullRequest size={15} aria-hidden="true" />
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
              onClick={(event) =>
                event.currentTarget.classList.toggle("expanded")
              }
            >
              <span>Show more activity</span>
              <Sparkles size={14} aria-hidden="true" />
            </button>
          </section>
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

      {activeTooltip && (
        <div
          className="contribution-tooltip"
          role="tooltip"
          style={{ left: activeTooltip.x, top: activeTooltip.y }}
        >
          {activeTooltip.text}
        </div>
      )}
    </section>
  );
};

export default ContributionCalendar;
