export const getAdminMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        businessName: req.user.businessName,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
