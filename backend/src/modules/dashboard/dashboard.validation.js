const isValidDate = (value) => {
  const date = new Date(value);

  return !Number.isNaN(
    date.getTime()
  );
};

const validatePagination = (
  page,
  limit,
  errors
) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    errors.page =
      "Page must be a positive integer.";
  }

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    errors.limit =
      "Limit must be an integer between 1 and 100.";
  }
};

export const validateDashboardDateRange = (
  req,
  res,
  next
) => {
  const {
    startDate,
    endDate,
  } = req.query;

  const errors = {};

  if (startDate && !isValidDate(startDate)) {
    errors.startDate =
      "Start date must be a valid date.";
  }

  if (endDate && !isValidDate(endDate)) {
    errors.endDate =
      "End date must be a valid date.";
  }

  if (
    startDate &&
    endDate &&
    isValidDate(startDate) &&
    isValidDate(endDate)
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      errors.dateRange =
        "Start date cannot be after end date.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

export const validateDashboardPagination = (
  req,
  res,
  next
) => {
  const {
    page = 1,
    limit = 20,
  } = req.query;

  const errors = {};

  validatePagination(
    page,
    limit,
    errors
  );

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
