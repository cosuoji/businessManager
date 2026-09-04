import { CalendarDays } from "lucide-react";

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const DashboardHeader = ({
  startDate,
  endDate,
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}) => {
  const periods = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "week",
      label: "This week",
    },
    {
      value: "month",
      label: "This month",
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];

  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
          Business overview
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-command-muted">
          Keep an eye on sales, payments,
          customers and outstanding balances.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:items-end">
        <div className="flex flex-wrap items-center gap-1 rounded-command-md border border-command-border bg-command-surface p-1">
          {periods.map((item) => {
            const active = period === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onPeriodChange(item.value)}
                className={`rounded-command-sm px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-command-green/10 text-command-green"
                    : "text-command-muted hover:bg-white/[0.03] hover:text-command-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {period === "custom" && (
          <div className="flex flex-col gap-3 rounded-command-md border border-command-border bg-command-surface p-4 sm:flex-row sm:items-end">
            <div>
              <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider text-command-muted">
                Start date
              </label>

              <input
                type="date"
                value={customStartDate}
                onChange={(event) =>
                  onCustomStartDateChange(
                    event.target.value
                  )
                }
                className="rounded-command-sm border border-command-border bg-command-black px-3 py-2 text-xs text-command-white outline-none transition focus:border-command-green/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider text-command-muted">
                End date
              </label>

              <input
                type="date"
                value={customEndDate}
                onChange={(event) =>
                  onCustomEndDateChange(
                    event.target.value
                  )
                }
                className="rounded-command-sm border border-command-border bg-command-black px-3 py-2 text-xs text-command-white outline-none transition focus:border-command-green/50"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 self-start rounded-command-md border border-command-border bg-command-surface px-3 py-2.5 lg:self-auto">
          <CalendarDays
            size={15}
            className="text-command-muted"
          />

          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-command-muted">
              Reporting period
            </p>

            <p className="mt-0.5 text-xs font-medium text-command-white">
              {formatDate(startDate)} —{" "}
              {formatDate(endDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
