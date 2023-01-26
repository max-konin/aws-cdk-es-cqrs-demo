import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

interface ReadStoreConfig {
  tableName: string;
  ddbClient: DocumentClient;
}

export const getAllAccounts = async (readStoreConfig: ReadStoreConfig) => {
  const rawResults = await readStoreConfig.ddbClient.scan({
    TableName: readStoreConfig.tableName
  }).promise();

  return rawResults.Items || []
}