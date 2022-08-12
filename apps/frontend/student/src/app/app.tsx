import { Route, Routes, Link } from 'react-router-dom';
import RenderRoutes from './routes.template';

export function App() {
  /*   const routeComponents =
    routes.length > 0 &&
    routes.map(({ path, Layout, props }: any, key: number) => (
      <Route path={path} element={<Layout {...props} />} key={key} />
    )); */

  return (
    <>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
      <RenderRoutes />
      {/* END: routes */}
    </>
  );
}

export default App;
