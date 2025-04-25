import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Posts } from './Posts';

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('character varying', { name: 'email', unique: true, length: 250 })
  email: string;

  @Column('character varying', { name: 'password', length: 250 })
  password: string;

  @Column('timestamp with time zone', {
    name: 'last_signed_in_at',
    nullable: true,
  })
  lastSignedInAt: Date | null;

  @OneToMany(() => Posts, (posts) => posts.createdBy)
  posts: Posts[];
}
