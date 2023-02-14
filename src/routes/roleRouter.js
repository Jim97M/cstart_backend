import express from 'express';
import { Authenticated, AdminRole } from '../middleware/authorizationPermission.js';
import * as  RoleController  from '../controllers/roleController.js';

const router = express.Router();

router.post('/create', Authenticated, AdminRole, RoleController.CreateRole);

export default router;
