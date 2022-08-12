import { MentorCreateCourse } from "CreateCourseComponent";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'Mentor_Create_Course': 
	 return <MentorCreateCourse {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;