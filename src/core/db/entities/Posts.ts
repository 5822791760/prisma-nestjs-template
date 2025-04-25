import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Users } from './Users';

@Index('posts_pkey', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Posts {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', nullable: true, length: 250 })
  title: string | null;

  @Column('text', { name: 'details', default: () => "''" })
  details: string;

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

  @ManyToOne(() => Users, (users) => users.posts, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
  createdBy: Users;
}
