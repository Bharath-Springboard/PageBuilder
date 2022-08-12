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
import { Student } from '../entities/Student';

@ObjectType()
class StudentFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class StudentResponse {
  @Field(() => [StudentFieldError], { nullable: true })
  errors?: StudentFieldError[];

  @Field(() => Student, { nullable: true })
  student?: Student;
}

@Resolver(Student)
export class StudentResolver {
  // Get the logged in student
  @Query(() => Student, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<Student | undefined> {
    // Not logged in
    if (!req.session.userId) {
      return undefined;
    }
    return await Student.findOne({ where: { id: req.session.userId } });
  }

  // Registration endpoint
  @Mutation(() => StudentResponse, { nullable: true })
  async signupstudent(
    @Arg('options') options: UsernamePasswordRegistrationInput,
    @Ctx() { req }: MyContext
  ): Promise<StudentResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    // Hash the password before storing in the DB
    const hashedPassword = await argon2.hash(options.password);
    let student;
    try {
      student = await Student.create({
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

    if (student) {
      req.session.userId = student.id;
    }
    return { student };
  }

  @Mutation(() => StudentResponse)
  async studentlogin(
    @Arg('username') userNameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<StudentResponse> {
    // Find if user is present in DB
    const student = await Student.findOne(
      userNameOrEmail.includes('@')
        ? { where: { email: userNameOrEmail } }
        : { where: { username: userNameOrEmail } }
    );

    if (!student) {
      return {
        errors: [
          {
            field: 'username',
            message: "user doesn't exist",
          },
        ],
      };
    }

    const verifiedPassword = await argon2.verify(student?.password, password);

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
    req.session.userId = student.id;

    return {
      student,
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
}
