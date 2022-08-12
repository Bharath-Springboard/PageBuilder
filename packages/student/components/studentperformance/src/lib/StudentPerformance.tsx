/* eslint-disable-next-line */
export interface StudentPerformanceProps {
  [key: string]: any;
}

export function StudentPerformance({ tasks, hello }: StudentPerformanceProps) {
  return (
    <div>
      <h1>Welcome to StudentPerformance!</h1>
      {tasks}
      {hello}
    </div>
  );
}

export default StudentPerformance;
