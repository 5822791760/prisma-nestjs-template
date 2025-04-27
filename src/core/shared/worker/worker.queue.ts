export const QUEUE = {
  users: 'users',
  crons: 'crons',
} as const;

export type IQUEUE = (typeof QUEUE)[keyof typeof QUEUE];
