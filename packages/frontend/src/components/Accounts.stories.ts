import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Accounts from "./Accounts";
import { graphql } from 'msw';
import { v4 } from "uuid";
import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  aws_appsync_region: 'us-east-2',
  aws_appsync_graphqlEndpoint: '/graphql',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: 'fake',
  Auth: {
    userPoolId: 'us-east-1_dmJ7e7moi',
    authenticationFlowType: 'USER_SRP_AUTH',
    userPoolWebClientId: '6fkae6gmpvb0u8c38k8e95jo6h',
    identityPoolId: 'us-east-1:fb8cea0c-0372-4a63-a641-058d14ab6996',
    region: 'us-east-1',
  },
  Storage: {
    AWSS3: {
      bucket: 'backendstack-tldocumentsbucket4f1a8f77-tug0tnc9cqow', //REQUIRED -  Amazon S3 bucket name
      region: 'us-east-1', //OPTIONAL -  Amazon service region
    },
  },
});

Auth.configure();

Auth.currentSession = () => {
  return new Promise((resolve) => {
    resolve({
      getAccessToken: () => ({ getJwtToken: () => 'JWT'})

    })
  })
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Component/Accounts",
  component: Accounts,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: "List of Accounts",
      },
    },
    msw: {
      handlers: [
        graphql.query('GetAllAccounts', (_req, res, ctx) => {
          return res(ctx.data({
            getAllAccounts: [
              {
                id: v4(),
                balance: 0
              },
              {
                id: v4(),
                balance: 100
              }
            ]
          }))
        })
      ]
    }
  },
} satisfies Meta<typeof Accounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListAccounts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(canvas.getAllByTestId("account-row").length).toEqual(2);
  },
};
