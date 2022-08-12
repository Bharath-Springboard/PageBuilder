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
      case 'MENTOR_APP1_ID4': 
	 return <StudentPerformance {...props.options} />;
case 'MENTOR_APP1_ID5': 
	 return <StudentProgress {...props.options} />;
case 'MENTOR_APP1_ID6': 
	 return <SubscribedCourses {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;