import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export const initDocumentsBucket = (scope: Construct) => {
  return new s3.Bucket(scope, 'tl-documents-bucket', {
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    cors: [
      {
        allowedMethods: [
          s3.HttpMethods.GET,
          s3.HttpMethods.POST,
          s3.HttpMethods.PUT,
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      },
    ],
  });
};