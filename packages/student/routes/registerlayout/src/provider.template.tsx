import { RegisterComponent } from "packages/student/components/register-component/src/index";
export interface ProviderProps {
  appId: string;
  options?: {};
}

const Provider = (props: ProviderProps) => {
  const renderComponent = () => {
    switch (props.appId) {
      case 'REGISTER_COMPONENT_1': 
	 return <RegisterComponent {...props.options} />;

      default:
        return <>Default case</>;
    }
  };

  return <>{renderComponent()}</>;
};

export default Provider;