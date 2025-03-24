import { SystemUser } from '../types';
export declare const PROJECT_MANAGER_ID = "project_manager";
export declare const ProjectManager: SystemUser;
export declare function isProjectManager(userId: string): boolean;
interface Todo {
    taskRole?: string;
    taskId?: string;
    task?: {
        role?: string;
    };
}
export declare function getProjectRoles(todos: Todo[]): string[];
export {};
