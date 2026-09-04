import Customer from "./customer.model.js";

export const createCustomer = async (userId, data) => {
  const {
    name,
    phone,
    email,
    address,
    notes,
  } = data;

  const customer = await Customer.create({
    userId,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim().toLowerCase(),
    address: address?.trim(),
    notes: notes?.trim(),
  });

  return customer;
};

export const getCustomers = async ({
  userId,
  page = 1,
  limit = 20,
  search = "",
  archived = false,
}) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  const filter = {
    userId,
    isArchived: archived,
  };

  if (search.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),

    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      hasNextPage:
        currentPage < Math.ceil(total / perPage),
      hasPreviousPage: currentPage > 1,
    },
  };
};

export const getCustomerById = async (
  userId,
  customerId
) => {
  const customer = await Customer.findOne({
    _id: customerId,
    userId,
    isArchived: false,
  }).lean();

  if (!customer) {
    const error = new Error("Customer not found.");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

export const updateCustomer = async (
  userId,
  customerId,
  data
) => {
  const allowedFields = [
    "name",
    "phone",
    "email",
    "address",
    "notes",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] =
        typeof data[field] === "string"
          ? data[field].trim()
          : data[field];
    }
  }

  if (updates.email) {
    updates.email = updates.email.toLowerCase();
  }

  const customer = await Customer.findOneAndUpdate(
    {
      _id: customerId,
      userId,
      isArchived: false,
    },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customer) {
    const error = new Error("Customer not found.");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

export const archiveCustomer = async (
  userId,
  customerId
) => {
  const customer = await Customer.findOneAndUpdate(
    {
      _id: customerId,
      userId,
      isArchived: false,
    },
    {
      isArchived: true,
    },
    {
      new: true,
    }
  );

  if (!customer) {
    const error = new Error("Customer not found.");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

export const restoreCustomer = async (
    userId,
    customerId
) => {

  console.log(userId, customerId)
    const customer =
        await Customer.findOneAndUpdate(
            {
                _id: customerId,
                userId,
                isArchived: true,
            },
            {
                $set: {
                    isArchived: false,
                },
            },
            {
                new: true,
            }
        ).lean();



  if (!customer) {
        const error = new Error(
            "Archived customer not found."
        );

        error.statusCode = 404;

        throw error;
    }

    return customer;
};
