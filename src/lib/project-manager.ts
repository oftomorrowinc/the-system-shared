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
  availableRoles: ['ProjectManager'],
  preferredRoles: ['ProjectManager'],
  status: 'available',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function isProjectManager(userId: string): boolean {
  return userId === PROJECT_MANAGER_ID;
}

// Function to extract role names from todos (for backward compatibility)
interface Todo {
  taskRole?: string;
  taskId?: string;
  task?: {
    role?: string;
  };
}

export function getProjectRoles(todos: Todo[]): string[] {
  if (!todos || !Array.isArray(todos)) {
    return [];
  }

  const roles = new Set<string>();

  todos.forEach((todo) => {
    if (todo && typeof todo === 'object') {
      if (typeof todo.taskRole === 'string' && todo.taskRole.trim()) {
        roles.add(todo.taskRole);
      }

      if (todo.taskId && todo.task && todo.task.role) {
        roles.add(todo.task.role);
      }
    }
  });

  return Array.from(roles);
}
