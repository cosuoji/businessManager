import Joi from "joi";

export const validate = (
  schema
) => {
  return (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const {
      error,
      value,
    } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map(
          (detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })
        ),
      });
    }

    req.body = value.body;
    req.params = value.params;
    req.query = value.query;

    next();
  };
};
