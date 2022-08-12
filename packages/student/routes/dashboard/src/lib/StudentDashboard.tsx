import { useQuery } from '@apollo/client';
import { Grid, GridItem } from '@chakra-ui/react';
import Provider from '../provider.template';

/* eslint-disable-next-line */
export interface StudentDashboardProps {}

export function StudentDashboard(props: StudentDashboardProps) {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider
          appId="DASHBOARD_APP_ID2"
          options={{ tasks: 'test', hello: 'hello' }}
        />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="DASHBOARD_APP_ID1" />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="DASHBOARD_APP_ID3" />
      </GridItem>
      <GridItem w="100%" h="10" bg="blue.500">
        <Provider appId="other" />
      </GridItem>
    </Grid>
  );
}

export default StudentDashboard;
