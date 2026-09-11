import AuditLog from "./audit.model.js";

export const createAuditLog = async ({
  adminId,
  action,
  targetType = null,
  targetId = null,
  description,
  metadata = {},
  req = null,
  session = null,
}) => {
  if (!adminId) {
    throw new Error("Admin ID is required to create an audit log.");
  }

  if (!action) {
    throw new Error("Audit action is required.");
  }

  if (!description) {
    throw new Error("Audit description is required.");
  }

  const auditLog = await AuditLog.create(
    [
      {
        adminId,
        action,
        targetType,
        targetId,
        description,
        metadata,
        ipAddress: req?.ip || null,
        userAgent: req?.get("user-agent") || null,
      },
    ],
    session ? { session } : undefined
  );

  return auditLog[0];
};
