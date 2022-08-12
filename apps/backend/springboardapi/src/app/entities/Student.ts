import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './Course';

export type UserRoleType = 'student' | 'mentor';

@ObjectType()
@Entity()
export class Student extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;

  @Field(() => [Course], { nullable: true })
  @OneToMany(() => Course, (course) => course.students)
  courses: Course[];
}
