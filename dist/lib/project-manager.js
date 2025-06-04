'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProjectManager = exports.PROJECT_MANAGER_ID = void 0;
exports.isProjectManager = isProjectManager;
exports.PROJECT_MANAGER_ID = 'project_manager';
exports.ProjectManager = {
  id: exports.PROJECT_MANAGER_ID,
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
function isProjectManager(userId) {
  return userId === exports.PROJECT_MANAGER_ID;
}
