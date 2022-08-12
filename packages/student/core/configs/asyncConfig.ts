export const config = {
  restConfig: {
    typePatcher: {
      Todo: (data: any) => {
        try {
          if (data.user != null) {
            data.user = { __typename: 'User', ...data.user };
          }
          return data;
        } catch (e) {
          console.error('error : ', e);
        }
      },
    },
  },
  cacheConfig: {
    typePolicies: {
      Query: {
        fields: {
          getTodo: {
            read(_: any, { args, toReference }: any) {
              return toReference({
                __typename: 'Todo',
                id: args.id,
              });
            },
          },
          getUser: {
            read(_: any, { args, toReference }: any) {
              return toReference({
                __typename: 'User',
                id: args.id,
              });
            },
          },
        },
      },
    },
  },
  graphqlConfig: {},
};
