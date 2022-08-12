import styles from './student-components-studentprofile.module.css';

/* eslint-disable-next-line */
export interface StudentComponentsStudentprofileProps {}

export function StudentComponentsStudentprofile(
  props: StudentComponentsStudentprofileProps
) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to STUDENT PROFILE COMPONENT!</h1>
    </div>
  );
}

export default StudentComponentsStudentprofile;
