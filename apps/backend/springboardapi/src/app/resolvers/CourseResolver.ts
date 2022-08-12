/* eslint-disable quotes */
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getConnection, MoreThan } from 'typeorm';
import { MyContext } from '../../types';
import { Course } from '../entities/Course';
import { Mentor } from '../entities/Mentor';

@InputType()
class CreateCourseType {
  @Field()
  content: string;

  @Field()
  tags: string;

  @Field()
  category: string;

  @Field()
  title: string;
}

@ObjectType()
class PaginatedCourses {
  @Field(() => [Course])
  posts: Course[];

  @Field()
  total: number;
}

@Resolver(Course)
export class CourseResolver {
  @Query(() => [Course], { nullable: true })
  async courses(): Promise<Course[]> {
    const courses = await Course.find();
    return courses;
  }

  @Query(() => [Course], { nullable: true })
  async allStarReviews(): Promise<Course[]> {
    const posts = await Course.find({
      where: { rating: MoreThan(4) },
      relations: ['creator'],
    });
    return posts;
  }

  @Query(() => PaginatedCourses, { nullable: true })
  async findCourses(
    @Arg('limit', () => Int) limit: number,
    @Arg('skipVariable', () => Int) skipNumber: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('category', () => String, { nullable: true }) category: string,
    @Arg('mentor', () => String, { nullable: true }) mentor: string
  ): Promise<PaginatedCourses> {
    const realLimit = Math.min(50, limit);
    let creatorId;

    if (mentor) {
      const tempUser = await Mentor.findOne({ where: { username: mentor } });
      creatorId = tempUser?.id;
    }

    const query = Course.createQueryBuilder('course').where(`id is NOT NULL`);
    if (title) {
      query.andWhere(`LOWER("title") LIKE LOWER('%${title}%')`);
    }
    if (category) {
      query.andWhere(`"category" LIKE '%${category}%'`);
    }

    if (creatorId) {
      query.andWhere(`"creatorId" = ${creatorId}`);
    }

    query.skip(skipNumber).take(realLimit);
    console.log('QUERY ************ ');
    console.log(query);
    const posts = await query.getManyAndCount();

    return { posts: posts[0], total: posts[1] };
  }

  @Mutation(() => PaginatedCourses, { nullable: true })
  async filterCourses(
    @Arg('limit', () => Int) limit: number,
    @Arg('skipVariable', () => Int) skipNumber: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('category', () => String, { nullable: true }) category: string
  ): Promise<PaginatedCourses> {
    const realLimit = Math.min(50, limit);

    const query = Course.createQueryBuilder('course').where(`id is NOT NULL`);
    if (title) {
      query.andWhere(`LOWER("title") LIKE LOWER('%${title}%')`);
    }
    if (category) {
      query.andWhere(`"carYear" LIKE '%${category}%'`);
    }

    query.skip(skipNumber).take(realLimit);

    const posts = await query.getManyAndCount();

    return { posts: posts[0], total: posts[1] };
  }

  @Query(() => Course, { nullable: true })
  async course(@Arg('id') id: number): Promise<Course | undefined> {
    // return post based on id if and only if the car is not booked
    return await Course.findOne({
      where: { id: id },
      relations: ['creator'],
    });
  }

  @Query(() => [Course])
  async browseByCategory(): Promise<Course[]> {
    return await Course.createQueryBuilder()
      .select(['category', 'id'])
      .distinctOn(['category'])
      .getRawMany();
  }

  @Mutation(() => Boolean)
  async createCourse(
    @Arg('options') options: CreateCourseType,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log('OPTIONS RECEIVED ****************** : ');
    console.log(options);

    let creationStatus = true;

    try {
      await Course.create({
        title: options.title,
        category: options.category,
        content: options.content,
        rating: 0,
        creator: await Mentor.findOne({ where: { id: req.session.userId } }),
      }).save();
    } catch (error) {
      creationStatus = false;
      console.log(error);
    }

    return creationStatus;
  }

  @Mutation(() => Boolean)
  async rateCourse(
    @Arg('id') id: number,
    @Arg('userpoints') userpoints: number
  ): Promise<boolean> {
    let ratingSubmitted = false;

    try {
      const course = await Course.findOne({ where: { id: id } });

      if (course) {
        const totalPoints = course.rating + userpoints;
        course.rating = totalPoints;
        await Course.update(course.id, course);

        ratingSubmitted = true;
      }
    } catch (error) {
      ratingSubmitted = false;
      console.log('Updating user rating : ', error);
    }

    return ratingSubmitted;
  }

  @Mutation(() => Boolean)
  async updateCourse(
    @Arg('courseId') courseId: number,
    @Arg('options') options: CreateCourseType
  ): Promise<boolean> {
    console.log('DATA RECEIVED ****************** ');
    console.log(courseId);
    console.log('Options: ', options);
    let updatedResult = false;

    const course = await Course.findOne({ where: { id: courseId } });
    console.log('POST FOUND : ', course);
    console.log('IF CHECK ^^^^^^^^^^ ', course?.id);
    if (course?.id) {
      console.log('tyring Updation !!!!!!!!!!!!');
      try {
        await getConnection()
          .createQueryBuilder()
          .update(Course)
          .set({
            content: options.content,
            title: options.title,
            tags: [options.tags],
            category: options.tags,
          })
          .where('id = :id', { id: courseId })
          .execute();

        updatedResult = true;
      } catch (error) {
        console.log(error);
        updatedResult = false;
      }
    }

    return updatedResult;
  }
}
