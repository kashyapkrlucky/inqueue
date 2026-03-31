// import { useState, useCallback, useMemo } from 'react';
// import type { Task, TaskFilterFn, TaskSortFn, TaskFormData, TaskUpdateData } from '../types';
// import type { Task, TaskFilterFn } from '../types';
// import { TaskStatus, TaskPriority, UserRole, Department } from '../types';
// // import { createId } from '../utils/helpers';

// Custom hook with generics and advanced TypeScript features
export const useTasks = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

  // Mock data initialization with proper typing
//   useEffect(() => {
//     const initializeTasks = async () => {
//       try {
//         setLoading(true);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const mockTasks: Task[] = [
//           {
//             id: createId(),
//             title: 'Build TypeScript showcase app',
//             description: 'Create a comprehensive React app showcasing TypeScript features',
//             status: TaskStatus.IN_PROGRESS,
//             priority: TaskPriority.HIGH,
//             assignedTo: {
//               id: createId(),
//               name: 'John Doe',
//               email: 'john@example.com',
//               role: UserRole.DEVELOPER,
//               department: Department.ENGINEERING,
//             },
//             createdAt: new Date('2024-01-10'),
//             updatedAt: new Date('2024-01-11'),
//             tags: ['typescript', 'react', 'frontend'],
//             estimatedHours: 8,
//             actualHours: 5,
//           },
//           {
//             id: createId(),
//             title: 'Design UI components',
//             description: 'Create reusable UI components with Tailwind CSS',
//             status: TaskStatus.TODO,
//             priority: TaskPriority.MEDIUM,
//             assignedTo: {
//               id: createId(),
//               name: 'Jane Smith',
//               email: 'jane@example.com',
//               role: UserRole.DESIGNER,
//               department: Department.DESIGN,
//             },
//             createdAt: new Date('2024-01-11'),
//             updatedAt: new Date('2024-01-11'),
//             tags: ['design', 'ui', 'css'],
//             estimatedHours: 6,
//           },
//         ];
        
//         setTasks(mockTasks);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load tasks');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeTasks();
//   }, []);

//   // CRUD operations with proper typing
//   const createTask = useCallback((taskData: TaskFormData): Task => {
//     const newTask: Task = {
//       ...taskData,
//       id: createId(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
    
//     setTasks(prev => [...prev, newTask]);
//     return newTask;
//   }, []);

//   const updateTask = useCallback((id: string, updates: TaskUpdateData): Task | null => {
//     let updatedTask: Task | null = null;
    
//     setTasks(prev => prev.map(task => {
//       if (task.id === id) {
//         updatedTask = {
//           ...task,
//           ...updates,
//           updatedAt: new Date(),
//         };
//         return updatedTask;
//       }
//       return task;
//     }));
    
//     return updatedTask;
//   }, []);

//   const deleteTask = useCallback((id: string): boolean => {
//     let deleted = false;
    
//     setTasks(prev => {
//       const filtered = prev.filter(task => {
//         if (task.id === id) {
//           deleted = true;
//           return false;
//         }
//         return true;
//       });
//       return filtered;
//     });
    
//     return deleted;
//   }, []);

//   // Advanced filtering and sorting
//   const filterTasks = useCallback((filterFn: TaskFilterFn): Task[] => {
//     return tasks.filter(filterFn);
//   }, [tasks]);

//   const sortTasks = useCallback((sortFn: TaskSortFn): Task[] => {
//     return [...tasks].sort(sortFn);
//   }, [tasks]);

//   // Memoized computed values
//   const taskStats = useMemo(() => {
//     const total = tasks.length;
//     const completed = tasks.filter(t => t.status === 'done').length;
//     const inProgress = tasks.filter(t => t.status === 'in_progress').length;
//     const todo = tasks.filter(t => t.status === 'todo').length;
    
//     return {
//       total,
//       completed,
//       inProgress,
//       todo,
//       completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
//     };
//   }, [tasks]);

//   // Generic search function
//   const searchTasks = useCallback((query: string, fields: (keyof Task)[]): Task[] => {
//     if (!query.trim()) return tasks;
    
//     const lowercaseQuery = query.toLowerCase();
//     return tasks.filter(task =>
//       fields.some(field => {
//         const value = task[field];
//         return typeof value === 'string' && 
//                value.toLowerCase().includes(lowercaseQuery);
//       })
//     );
//   }, [tasks]);

//   return {
//     tasks,
//     loading,
//     error,
//     createTask,
//     updateTask,
//     deleteTask,
//     filterTasks,
//     sortTasks,
//     searchTasks,
//     taskStats,
//   };
};

// Type-safe hook for task filtering
// export const useTaskFilters = (tasks: Task[]) => {
//   const [activeFilters, setActiveFilters] = useState<TaskFilterFn[]>([]);

//   const addFilter = useCallback((filter: TaskFilterFn) => {
//     setActiveFilters(prev => [...prev, filter]);
//   }, []);

//   const removeFilter = useCallback((index: number) => {
//     setActiveFilters(prev => prev.filter((_, i) => i !== index));
//   }, []);

//   const clearFilters = useCallback(() => {
//     setActiveFilters([]);
//   }, []);

//   const filteredTasks = useMemo(() => {
//     return tasks.filter(task => 
//       activeFilters.every(filter => filter(task))
//     );
//   }, [tasks, activeFilters]);

//   return {
//     activeFilters,
//     addFilter,
//     removeFilter,
//     clearFilters,
//     filteredTasks,
//   };
// };

export const dummy = () => {
    
}