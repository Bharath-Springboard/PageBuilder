// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { Route, Routes, Link } from 'react-router-dom';
import RenderRoutes from './routes.template';

export function App() {
  return (
    <>
      <br />
      <hr />
      <br />
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
