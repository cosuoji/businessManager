export const validateCustomer = ({
  name,
  phone,
  email,
  address,
  notes,
}) => {
  const errors = {};

  if (!name?.trim()) {
    errors.name = "Customer name is required.";
  }

  if (!phone?.trim()) {
    errors.phone = "Customer phone number is required.";
  }

  if (name?.trim()?.length > 100) {
    errors.name = "Customer name cannot exceed 100 characters.";
  }

  if (phone?.trim()?.length > 30) {
    errors.phone = "Phone number cannot exceed 30 characters.";
  }

  if (email && email.trim().length > 150) {
    errors.email = "Email cannot exceed 150 characters.";
  }

  if (address && address.trim().length > 300) {
    errors.address = "Address cannot exceed 300 characters.";
  }

  if (notes && notes.trim().length > 1000) {
    errors.notes = "Notes cannot exceed 1000 characters.";
  }

  return errors;
};


export const validateCustomerUpdate = (data) => {
  const errors = {};

  if (
    data.name !== undefined &&
    !data.name?.trim()
  ) {
    errors.name = "Customer name cannot be empty.";
  }

  if (
    data.phone !== undefined &&
    !data.phone?.trim()
  ) {
    errors.phone = "Customer phone number cannot be empty.";
  }

  if (data.name?.trim()?.length > 100) {
    errors.name = "Customer name cannot exceed 100 characters.";
  }

  if (data.phone?.trim()?.length > 30) {
    errors.phone = "Phone number cannot exceed 30 characters.";
  }

  if (data.email?.trim()?.length > 150) {
    errors.email = "Email cannot exceed 150 characters.";
  }

  if (data.address?.trim()?.length > 300) {
    errors.address =
      "Address cannot exceed 300 characters.";
  }

  if (data.notes?.trim()?.length > 1000) {
    errors.notes =
      "Notes cannot exceed 1000 characters.";
  }

  return errors;
};
