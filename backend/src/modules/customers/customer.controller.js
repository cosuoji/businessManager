import {
  createCustomer,
  getCustomers,
  getCustomerById,
  archiveCustomer,
  updateCustomer,
  restoreCustomer as restoreCustomerService,
} from "./customer.service.js";

import {
  validateCustomer,
  validateCustomerUpdate,
} from "./customer.validation.js";

export const create = async (req, res, next) => {
  try {
    const errors = validateCustomer(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const customer = await createCustomer(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const result = await getCustomers({
      userId: req.user.id,
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search || "",
      archived: req.query.archived === "true",
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const customer = await getCustomerById(
      req.user.id,
      req.params.id
    );
    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const errors = validateCustomerUpdate(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const customer = await updateCustomer(
      req.user.id,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};


export const archive = async (req, res, next) => {
  try {
    await archiveCustomer(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Customer archived successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const restoreCustomer = async (
    req,
    res,
    next
) => {
    try {
        const customer =
            await restoreCustomerService(
                req.user.id,
                req.params.id
            );

        res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        next(error);
    }
};
