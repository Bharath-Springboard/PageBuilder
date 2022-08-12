import { Center } from '@chakra-ui/react';
import Provider from '../provider.template';

/* eslint-disable-next-line */
export interface ProfilelayoutProps {}

export function Profilelayout(props: ProfilelayoutProps) {
  return (
    <Center>
      <Provider appId="PROFILE_COMPONENT_1" />
    </Center>
  );
}

export default Profilelayout;
