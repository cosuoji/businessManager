export const assertOwnership = (resource, userId) => {
  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  if (resource.userId.toString() !== userId.toString()) {
    const error = new Error("You do not have access to this resource.");
    error.statusCode = 403;
    throw error;
  }

  return resource;
};
