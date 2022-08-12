import { StudentComponentsStudentprofile } from "packages/student/components/studentprofile/src/index";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'PROFILE_COMPONENT_1': 
	 return <StudentComponentsStudentprofile {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;