import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './Course';
import { Student } from './Student';

export type StudentProgressType = 'not started' | 'in progress' | 'completed';

@ObjectType()
@Entity()
export class StudentProgress extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @Field()
  @Column({
    type: 'enum',
    enum: ['not started', 'in progress', 'completed'],
    default: 'not started',
  })
  role: StudentProgressType;

  @Field(() => Course, { nullable: true })
  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;

  @Field(() => Student, { nullable: true })
  @ManyToOne(() => Student)
  @JoinColumn()
  creator: Student;
}
