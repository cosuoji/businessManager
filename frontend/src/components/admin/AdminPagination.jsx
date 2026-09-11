const AdminPagination = ({
  pagination,
  onPrevious,
  onNext,
}) => {
  const {
    page,
    totalPages,
    total,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-command-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-command-muted">
        Page{" "}
        <span className="font-mono text-white">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-mono text-white">
          {totalPages}
        </span>
        {" · "}
        {total} users
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPreviousPage}
          className="rounded-lg border border-command-border px-3 py-2 text-xs transition-colors hover:bg-command-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNextPage}
          className="rounded-lg border border-command-border px-3 py-2 text-xs transition-colors hover:bg-command-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
