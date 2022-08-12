import { AuthLayout } from 'authlayout';
import { LoginComponent } from 'LoginComponent';
import { SignupComponent } from 'SignupComponent';
import { StudentDashboard } from 'dashboard';
import { Explorelayout } from 'explorelayout';
import { Profilelayout } from 'profilelayout';
import { Registerlayout } from 'registerlayout';

import { Route, Routes } from 'react-router-dom';

const RenderRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginComponent />}></Route>
        <Route path="signup" element={<SignupComponent />}></Route>
      </Route>
      <Route path="/dashboard" element={<StudentDashboard />} />

      <Route path="/explore" element={<Explorelayout />} />

      <Route path="/profile" element={<Profilelayout />} />

      <Route path="/register" element={<Registerlayout />} />
    </Routes>
  );
};

export default RenderRoutes;
