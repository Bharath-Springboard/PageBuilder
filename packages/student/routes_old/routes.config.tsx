import { StudentDashboard } from 'dashboard';
import { Profilelayout } from 'profilelayout';
import { LoginComponent } from 'LoginComponent';
import { SignupComponent } from 'SignupComponent';
import { Explorelayout } from 'explorelayout';
import { Registerlayout } from 'registerlayout';
import { Link, Route, Routes } from 'react-router-dom';
import { AuthLayout } from 'authlayout';

const RenderRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <>
            <StudentDashboard />
            <div>
              <h1>I am Dashboard page</h1>
              <br />
              <Link to="/explore">Click here for Explore Page.</Link>
              <br />
              <Link to="/register">Click here for Register Page.</Link>
              <br />
              <Link to="/profile">Click here for Profile Page.</Link>
              <br />
            </div>
          </>
        }
      />
      <Route
        path="/explore"
        element={
          <div>
            <Explorelayout />
            <br />
            <Link to="/dashboard">
              Click here to go back to dashboard page.
            </Link>
          </div>
        }
      />
      <Route path="/register" element={<Registerlayout />} />
      <Route
        path="/profile"
        element={
          <div>
            <Profilelayout />
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
