import { Center } from '@chakra-ui/react';
import Provider from '../provider.template';

/* eslint-disable-next-line */
export interface RegisterlayoutProps {}

export function Registerlayout(props: RegisterlayoutProps) {
  return (
    <Center>
      <Provider appId="REGISTER_COMPONENT_1" />
    </Center>
  );
}

export default Registerlayout;
