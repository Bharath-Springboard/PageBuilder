import { Button } from '@chakra-ui/button';
import { Box, Divider, Flex, Link, Text } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { InputField } from 'InputField';
import { Outlet, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
/* eslint-disable-next-line */
import { toErrorMap } from 'packages/shared/utils/to-error-map/src';
/* eslint-disable-next-line */
export interface LoginComponentProps {
  appname?: string | undefined;
}

const LOGIN_MUTATION_MENTOR = gql`
  mutation Mentorlogin($password: String!, $username: String!) {
    mentorlogin(password: $password, username: $username) {
      errors {
        field
        message
      }
      mentor {
        id
        username
      }
    }
  }
`;

const LOGIN_MUTATION_STUDENT = gql`
  mutation Studentlogin($password: String!, $username: String!) {
    studentlogin(password: $password, username: $username) {
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

export function LoginComponent(props: LoginComponentProps) {
  const navigate = useNavigate();
  const login_mutation =
    props.appname === 'mentor' ? LOGIN_MUTATION_MENTOR : LOGIN_MUTATION_STUDENT;
  const [login, { data, loading, error }] = useMutation(login_mutation);

  return (
    <div style={{ margin: 'auto', maxWidth: 500, paddingTop: 50 }}>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: { username: values.username, password: values.password },
          });

          if (response.data?.mentorlogin?.errors) {
            setErrors(toErrorMap(response.data.mentorlogin.errors));
          } else if (response.data?.studentlogin?.errors) {
            setErrors(toErrorMap(response.data?.studentlogin?.errors));
          } else {
            navigate('/dashboard');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={4}>
              <Box mt={4} minW={400}>
                <InputField
                  helperText="Enter the user name or Email"
                  name="username"
                  label="UserName"
                  placeholder="Enter UserName or Email"
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

              <Flex mt={2} alignItems="center">
                <Button
                  mt="4"
                  colorScheme="red"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Login
                </Button>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
      <Outlet />
    </div>
  );
}

export default LoginComponent;
