import Provider from '../provider.template';
import { Outlet } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AuthLayoutProps {}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <>
      <div>
        <Provider appId="" />
      </div>
      <Outlet />
    </>
  );
}

export default AuthLayout;
