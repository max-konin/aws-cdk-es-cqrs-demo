import * as AWS from 'aws-sdk';
import { getAllAccounts } from './queries/get-all-accounts';

type AppSyncEvent = {
  info: {
    fieldName: string
  },
  args: any
}

export const handler = (appSyncEvent: AppSyncEvent) => {
  if (!process.env.ACCOUNTS_TABLE_NAME) throw new Error('Missing process.env.ACCOUNTS_TABLE_NAME');
  const ddbClient = new AWS.DynamoDB.DocumentClient();

  switch (appSyncEvent.info.fieldName) {
    case 'getAllAccounts':
      return getAllAccounts({ ddbClient, tableName: process.env.ACCOUNTS_TABLE_NAME });
    default:
      throw new Error('Unknown Query');
  }
}