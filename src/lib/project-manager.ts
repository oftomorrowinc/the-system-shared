// src/lib/project-manager.ts
import { SystemUser } from '../types';

export const PROJECT_MANAGER_ID = 'project_manager';

export const ProjectManager: SystemUser = {
  id: PROJECT_MANAGER_ID,
  name: 'Project Manager',
  username: 'ProjectManager',
  email: 'system@thesystem.ai',
  isSystemAdmin: false,
  isAi: true,
  metrics: {
    tasksCompleted: 0,
    successRate: 1,
    avgResponseTime: 0,
    specialties: {},
  },
  status: 'available',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function isProjectManager(userId: string): boolean {
  return userId === PROJECT_MANAGER_ID;
}
