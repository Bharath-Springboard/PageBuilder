import { Link, Route, Routes } from 'react-router-dom';
import { AuthLayout } from 'authlayout';
import { MentorDashboardLayout } from 'MentorDashboardLayout';
import { MentorProfileLayout } from 'MentorProfileLayout';
import { LoginComponent } from 'LoginComponent';
import { SignupComponent } from 'SignupComponent';
import { MentorCreateCourseLayout } from 'MentorCreateCourseLayout';
import { MentorCourseDetailsLayout } from 'CourseDetailsLayout';

const RenderRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <>
            <MentorDashboardLayout />
            <div>
              <h1>I am Dashboard page</h1>
              <br />
              <Link to="/register">Click here for Register Page.</Link>
              <br />
              <Link to="/profile">Click here for Profile Page.</Link>
              <br />
            </div>
          </>
        }
      />
      <Route path="/createcourse" element={<MentorCreateCourseLayout />} />
      <Route path="/course" element={<MentorCourseDetailsLayout />} />
      <Route
        path="/profile"
        element={
          <div>
            <MentorProfileLayout />
            <br />
            <Link to="/dashboard">
              Click here to go back to dashboard page.
            </Link>
          </div>
        }
      />
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<LoginComponent />} />
        <Route path="login" element={<LoginComponent />} />
        <Route path="signup" element={<SignupComponent />} />
      </Route>
    </Routes>
  );
};

export default RenderRoutes;
