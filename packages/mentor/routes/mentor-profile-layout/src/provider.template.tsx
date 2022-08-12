import { StudentComponentsStudentprofile } from "packages/student/components/studentprofile/src/index";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'MENTOR_APP1_ID3': 
	 return <StudentComponentsStudentprofile {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;