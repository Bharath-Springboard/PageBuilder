import { Grid, GridItem } from '@chakra-ui/react';
import Provider from '../provider.template';

/* eslint-disable-next-line */
export interface MentorDashboardLayoutProps {}

export function MentorDashboardLayout(props: MentorDashboardLayoutProps) {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="MENTOR_APP1_ID4" />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="MENTOR_APP1_ID5" />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="MENTOR_APP1_ID6" />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="other" />
      </GridItem>
    </Grid>
  );
}

export default MentorDashboardLayout;
