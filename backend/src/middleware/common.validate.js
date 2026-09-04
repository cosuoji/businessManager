import Joi from "joi";

export const objectId =
  Joi.string().hex().length(24);

export const paginationSchema = {
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
};

export const createCustomerSchema =
  Joi.object({
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),

      phone: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),

      email: Joi.string()
        .email()
        .max(150)
        .optional(),

      address: Joi.string()
        .trim()
        .max(300)
        .optional(),

      notes: Joi.string()
        .trim()
        .max(1000)
        .optional(),
    }).required(),

    params: Joi.object({}),

    query: Joi.object({}),
  });

export const customerIdSchema =
  Joi.object({
    params: Joi.object({
      id: objectId.required(),
    }).required(),

    body: Joi.object({}),

    query: Joi.object({}),
  });

export const listCustomersSchema =
  Joi.object({
    query: Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .default(1),

      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20),

      search: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .optional(),
    }).required(),

    params: Joi.object({}),

    body: Joi.object({}),
  });

export const orderItemSchema =
  Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required(),

    quantity: Joi.number()
      .integer()
      .min(1)
      .required(),

    sellingPrice: Joi.number()
      .min(0)
      .required(),

    productCost: Joi.number()
      .min(0)
      .required(),
  });

export const paymentSchema =
  Joi.object({
    body: Joi.object({
      orderId:
        objectId.required(),

      amount: Joi.number()
        .positive()
        .precision(2)
        .required(),

      paymentMethod:
        Joi.string()
          .valid(
            "cash",
            "bank_transfer",
            "pos",
            "mobile_money",
            "card",
            "other"
          )
          .required(),

      paymentDate:
        Joi.date()
          .optional(),

      reference:
        Joi.string()
          .trim()
          .max(100)
          .optional(),

      notes:
        Joi.string()
          .trim()
          .max(500)
          .optional(),
    }).required(),

    params: Joi.object({}),

    query: Joi.object({}),
  });
