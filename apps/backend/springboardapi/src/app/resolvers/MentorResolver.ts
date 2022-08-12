import * as argon2 from 'argon2';
import { MyContext } from '../../types';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { validateRegister } from '../utils/validateRegister';
import { UsernamePasswordRegistrationInput } from './usernamePasswordRegistrationInput';
import { _COOKIE_NAME } from '../../constants';
import { Mentor } from '../entities/Mentor';
import { Course } from '../entities/Course';

@ObjectType()
class MentorFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class MentorResponse {
  @Field(() => [MentorFieldError], { nullable: true })
  errors?: MentorFieldError[];

  @Field(() => Mentor, { nullable: true })
  mentor?: Mentor;
}

@Resolver(Mentor)
export class MentorResolver {
  // Get the logged in student
  @Query(() => Mentor, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<Mentor | undefined> {
    // Not logged in
    if (!req.session.userId) {
      return undefined;
    }
    return await Mentor.findOne({ where: { id: req.session.userId } });
  }

  // Registration endpoint
  @Mutation(() => MentorResponse, { nullable: true })
  async mentorsignup(
    @Arg('options') options: UsernamePasswordRegistrationInput,
    @Ctx() { req }: MyContext
  ): Promise<MentorResponse> {
    console.log('REQUEST RECEIVED : ', options);
    const errors = validateRegister(options);
    console.log('Errors : ', errors);
    if (errors) {
      return { errors };
    }

    // Hash the password before storing in the DB
    const hashedPassword = await argon2.hash(options.password);
    let mentor;
    try {
      mentor = await Mentor.create({
        username: options.username,
        password: hashedPassword,
        email: options.email,
      }).save();
    } catch (err) {
      console.log(err);
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already exists.',
            },
          ],
        };
      }
    }

    console.log('Mentor addedd : ', mentor);

    if (mentor) {
      req.session.userId = mentor.id;
    }
    return { mentor };
  }

  @Mutation(() => MentorResponse)
  async mentorlogin(
    @Arg('username') userNameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<MentorResponse> {
    // Find if user is present in DB
    const mentor = await Mentor.findOne(
      userNameOrEmail.includes('@')
        ? { where: { email: userNameOrEmail } }
        : { where: { username: userNameOrEmail } }
    );

    if (!mentor) {
      return {
        errors: [
          {
            field: 'username',
            message: "user doesn't exist",
          },
        ],
      };
    }

    const verifiedPassword = await argon2.verify(mentor?.password, password);

    if (!verifiedPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password is incorrect.',
          },
        ],
      };
    }

    //Set the session
    req.session.userId = mentor.id;

    return {
      mentor,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return false;
        }
        res.clearCookie(_COOKIE_NAME);
        resolve(true);
        return true;
      })
    );
  }

  // Mutation to add Blog
  @Mutation(() => Boolean)
  async addBlog(
    @Arg('courseData') courseData: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    let courseCreationSuccess = false;

    try {
      await Course.create({
        content: courseData,
        creator: await Mentor.findOne({ where: { id: req.session.userId } }),
      }).save();

      courseCreationSuccess = true;
    } catch (error) {
      courseCreationSuccess = false;
    }

    return courseCreationSuccess;
  }
}
