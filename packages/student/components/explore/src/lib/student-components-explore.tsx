import styles from './student-components-explore.module.css';

/* eslint-disable-next-line */
export interface StudentComponentsExploreProps {}

export function StudentComponentsExplore(props: StudentComponentsExploreProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to STUDENT EXPLORE COMPONENT !</h1>
    </div>
  );
}

export default StudentComponentsExplore;
