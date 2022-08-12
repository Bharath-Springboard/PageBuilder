import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { InputField } from 'InputField';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
/* eslint-disable-next-line */
import { toErrorMap } from 'packages/shared/utils/to-error-map/src';

/* eslint-disable-next-line */
export interface SignupComponentProps {
  appname?: string | undefined;
}

const REGISTER_MENTOR = gql`
  mutation Mentorsignup($options: UsernamePasswordRegistrationInput!) {
    mentorsignup(options: $options) {
      errors {
        field
        message
      }
      mentor {
        email
        id
      }
    }
  }
`;

const REGISTER_STUDENT = gql`
  mutation Signupstudent($options: UsernamePasswordRegistrationInput!) {
    signupstudent(options: $options) {
      errors {
        field
        message
      }
      student {
        id
        username
      }
    }
  }
`;

export function SignupComponent(props: SignupComponentProps) {
  const register_user =
    props.appname === 'mentor' ? REGISTER_MENTOR : REGISTER_STUDENT;
  const [registerUser, { data, loading, error }] = useMutation(register_user);
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 50 }}>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await registerUser({
            variables: { options: values },
          });

          if (
            response.data.mentorsignup?.mentor?.id ||
            response.data.signupstudent?.student?.id
          ) {
            navigate('/dashboard');
          } else {
            if (response.data.signupstudent.errors) {
              setErrors(toErrorMap(response.data.signupstudent.errors));
            } else if (response.data.mentorsignup.errors) {
              setErrors(toErrorMap(response.data.mentorsignup.errors));
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              helperText="Enter UserName"
              name="username"
              label="username"
              placeholder="Enter the username"
            />
            <Box mt={4}>
              <InputField
                helperText="Enter Email"
                name="email"
                label="email"
                placeholder="Enter the Email"
              />
            </Box>

            <Box mt="4">
              <InputField
                helperText="Enter password"
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              mt="4"
              colorScheme="red"
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupComponent;
