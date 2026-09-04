import { AlertCircle, Clock3, ListFilter, Users } from "lucide-react";

const OutstandingFilters = ({
  mode,
  view,
  onModeChange,
  onViewChange,
}) => {
  const modes = [
    {
      value: "orders",
      label: "Orders",
      icon: ListFilter,
    },
    {
      value: "customers",
      label: "Customers",
      icon: Users,
    },
  ];

  const views = [
    {
      value: "all",
      label: "All Outstanding",
      icon: ListFilter,
    },
    {
      value: "due-soon",
      label: "Due Soon",
      icon: Clock3,
    },
    {
      value: "overdue",
      label: "Overdue",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Primary mode */}
      <div className="flex flex-wrap command-btn items-center gap-2">
        {modes.map((item) => {
          const Icon = item.icon;
          const active = mode === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onModeChange(item.value)}
              className={`
                inline-flex items-center gap-2 rounded-lg border px-3 py-2
                text-sm font-medium transition
                ${
                  active
                    ? "border-command-green/20 bg-command-green/10 text-command-green"
                    : "border-command-border text-command-muted"
                }
              `}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Order filters */}
      {mode === "orders" && (
        <div className="flex flex-wrap command-btn items-center gap-2">
          {views.map((item) => {
            const Icon = item.icon;
            const active = view === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onViewChange(item.value)}
                className={`
                  inline-flex items-center gap-2 rounded-lg border px-3 py-2
                  text-sm transition
                  ${
                    active
                      ? "border-command-green/20 bg-command-green/10 text-command-green"
                      : "border-command-border text-command-muted"
                  }
                `}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OutstandingFilters;
