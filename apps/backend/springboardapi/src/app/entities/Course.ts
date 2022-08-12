import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mentor } from './Mentor';
import { Student } from './Student';

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @Field(() => String, { nullable: false })
  @Column()
  title: string;

  @Field(() => String, { nullable: false })
  @Column()
  category: string;

  @Field(() => [String], { nullable: false })
  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Field(() => String, { nullable: false })
  @Column()
  content: string;

  @Field(() => Int, { nullable: true })
  @Column()
  rating: number;

  @Field(() => Student, { nullable: true })
  @ManyToOne(() => Student, (student) => student.courses)
  students: Student[];

  @Field(() => Mentor, { nullable: true })
  @ManyToOne(() => Mentor, (mentor) => mentor.courses)
  creator: Mentor;
}
