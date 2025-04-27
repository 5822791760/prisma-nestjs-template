export const QUEUE = {
  USERS: 'USERS',
  CRONS: 'CRONS',
} as const;

export type QUEUE = (typeof QUEUE)[keyof typeof QUEUE];
