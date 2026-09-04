export const validateRegistration = ({
  name,
  email,
  phone,
  businessName,
  password,
}) => {
  const errors = {};


  if (!name?.trim()) {
    errors.name = "Name is required.";
  }

  if (!email?.trim()) {
    errors.email = "Email is required.";
  }

  if (!phone?.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!businessName?.trim()) {
    errors.businessName = "Business name is required.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};

export const validatePasswordReset = (password) => {
  const errors = {};

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password =
      "Password must be at least 8 characters.";
  }

  return errors;
};
