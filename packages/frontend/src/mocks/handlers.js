import { graphql } from 'msw'



export const handlers = [
  graphql.query('GetAllAccounts', (res, ctx) => {
    return res(ctx.data({
      getAllAccounts: [
        { id: '1', balance: 0 },
        { id: '2', balance: 100 }
      ]
    }));
  })
]