import { StudentComponentsExplore } from "packages/student/components/explore/src/index";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'EXPLORE_COMPONENT_1': 
	 return <StudentComponentsExplore {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;