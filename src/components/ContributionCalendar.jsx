import { useState } from "react";
import useGitHubContributions from "../hooks/useGitHubContributions";

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

const ContributionCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const { contributions, total, loading, error } =
    useGitHubContributions(selectedYear);

  const calendarDays = contributions.length
    ? [
        ...Array.from(
          {
            length: new Date(`${contributions[0].date}T00:00:00`).getDay(),
          },
          () => null,
        ),
        ...contributions,
      ]
    : [];

  while (calendarDays.length && calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const weeks = [];

  for (let index = 0; index < calendarDays.length; index += 7) {
    weeks.push(calendarDays.slice(index, index + 7));
  }

  const monthLabels = weeks.reduce((labels, week, index) => {
    const firstDay = week.find(Boolean);

    if (!firstDay) return labels;

    const date = new Date(`${firstDay.date}T00:00:00`);
    const month = date.getMonth();
    const previousLabel = labels[labels.length - 1];

    if (!previousLabel || previousLabel.month !== month) {
      labels.push({
        index,
        month,
        label: date.toLocaleDateString("en", {
          month: "short",
        }),
      });
    }

    return labels;
  }, []);

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
        <div className="contribution-calendar-wrapper">
          {error ? (
            <p className="section-message" role="alert">
              Unable to load contributions: {error}
            </p>
          ) : loading ? (
            <p className="section-message">Fetching contribution activity...</p>
          ) : contributions.length === 0 ? (
            <p className="section-message">
              No contribution data is available for {selectedYear}.
            </p>
          ) : (
            <div className="contribution-calendar-layout">
              <div className="contribution-weekday-labels" aria-hidden="true">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>

              <div className="contribution-calendar-content">
                <div
                  className="contribution-months"
                  style={{
                    "--contribution-weeks": weeks.length,
                  }}
                >
                  {monthLabels.map((month) => (
                    <span
                      key={`${month.month}-${month.index}`}
                      style={{
                        gridColumn: month.index + 1,
                      }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="contribution-calendar">
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

          {!loading && !error && contributions.length > 0 && (
            <div className="contribution-legend">
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
          )}
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
    </section>
  );
};

export default ContributionCalendar;
