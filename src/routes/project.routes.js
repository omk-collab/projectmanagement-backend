import { Router } from "express";
import {
  addMembersToProject,
  createProjects,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateMemberRole,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { validate } from "../middlewares/validator.middleware.js";

import {    
    createProjectValidator ,
    addMembertoProjectValidator
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(),validate,createProjects)

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole),getProjectById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject
  )
  .delete(
  validateProjectPermission([UserRolesEnum.ADMIN]),
  deleteProject);

  router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject
  )
  
 router
   .route("/:projectId/members/:userId")
   .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
   .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember);
  
export default router