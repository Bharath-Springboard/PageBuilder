import { Center } from '@chakra-ui/react';
import Provider from '../provider.template';

/* eslint-disable-next-line */
export interface ExplorelayoutProps {}

export function Explorelayout(props: ExplorelayoutProps) {
  return (
    <Center>
      <Provider appId="EXPLORE_COMPONENT_1" />
    </Center>
  );
}

export default Explorelayout;
