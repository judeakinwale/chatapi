/**
 * 
user
email
resourceName
operation
description
changes
createdBy
createdAt
 */

const AuditTrail = require("../models/AuditTrail");
const User = require("../models/User");
const { loginWorkaround } = require("./userUtils");
const { updateMetaData } = require("./utils");

exports.generateAudit = async (payload) => {
  console.log({ payload });
  const audit = await AuditTrail.create(payload);
  return audit;
};

exports.getUser = async (user) => {
  if (user?.email) return user;
  return await User.findById(user);
};

exports.updatePayloadAndGenerateAudit = async (user, payload) => {
  payload = {
    ...payload,
    user,
    email: user?.email,
    createdBy: user,
    createdAt: new Date(),
  };

  const response = await this.generateAudit(payload);
  console.log({ auditResponse: response });
  return response;
};

exports.createAudit = async (user, resourceName, changes = undefined) => {
  user = await this.getUser(user);
  const payload = {
    resourceName,
    operation: "create",
    changes,
  };
  payload.description = `${resourceName} Created`;
  if (user) {
    payload.description = `${resourceName} Created By ${user.lastname} ${user.firstname}`;
  }
  return this.updatePayloadAndGenerateAudit(user, payload);
};

exports.updateAudit = async (
  user,
  resourceName,
  resourceId,
  changes = undefined
) => {
  user = await this.getUser(user);
  const payload = {
    resourceName,
    operation: "update",
    changes,
  };
  payload.description = `${resourceName} with id: ${resourceId} Updated`;
  if (user) {
    payload.description = `${resourceName} with id: ${resourceId} Updated By ${user.lastname} ${user.firstname}`;
  }
  return this.updatePayloadAndGenerateAudit(user, payload);
};

exports.deleteAudit = async (
  user,
  resourceName,
  resourceId,
  changes = undefined
) => {
  user = await this.getUser(user);
  const payload = {
    resourceName,
    operation: "delete",
    changes,
  };
  payload.description = `${resourceName} with id: ${resourceId} Deleted`;
  if (user) {
    payload.description = `${resourceName} with id: ${resourceId} Deleted By ${user.lastname} ${user.firstname}`;
  }
  return this.updatePayloadAndGenerateAudit(user, payload);
};

exports.customAudit = async (user, action) => {
  user = await this.getUser(user);
  const payload = {
    operation: "login",
    description: `${user.lastname} ${user.firstname} ${action}`,
  };
  if (!user) payload.description = `A User ${action}`;

  return this.updatePayloadAndGenerateAudit(user, payload);
};

exports.loginAudit = async(user) => await this.customAudit(user, "logged in")
exports.logoutAudit = async (user) => await this.customAudit(user, "logged out");

exports.audit = {
  create: this.createAudit,
  update: this.updateAudit,
  delete: this.deleteAudit,
  login: this.loginAudit,
  logout: this.logoutAudit,
  custom: this.customAudit,
};
