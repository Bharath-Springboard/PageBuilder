import { StudentPerformance } from "studentperformance";
import { StudentProgress } from "studentprogress";
import { SubscribedCourses } from "subscribedcourses";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'DASHBOARD_APP_ID2': 
	 return <StudentPerformance {...props.options} />;
case 'DASHBOARD_APP_ID3': 
	 return <StudentProgress {...props.options} />;
case 'DASHBOARD_APP_ID1': 
	 return <SubscribedCourses {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;