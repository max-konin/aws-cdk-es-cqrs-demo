import {
  GraphQLAPI,
  GraphQLResult,
  GRAPHQL_AUTH_MODE,
  graphqlOperation,
} from '@aws-amplify/api-graphql';
import Observable from 'zen-observable';

let instance: API | undefined = undefined;

export function amplifyFetcher<TData, TVariables>(
  query: string,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const api = API.getInstance();
    const response = await api.query(query, variables);
    return response.data;
  };
}

export function amplifySubscriber<TData, TVariables>(
  query: string,
  observer: ZenObservable.Observer<TData>,
  variables?: TVariables
) {
  return () => {
    const api = API.getInstance();
    return api.subscription(query, variables).subscribe(observer);
  };
}

export class API {
  protected isSignedIn: boolean = false;

  constructor() {
    this.isSignedIn = false;
  }

  static getInstance(): API {
    if (!instance) instance = new API();
    return instance;
  }

  static updateIsSignedIn(signedIn: boolean): void {
    if (!instance) instance = new API();
    instance.isSignedIn = signedIn;
  }

  public async query(query: string, variables?: any) {
    // const operation = {
    //   authMode: this.isSignedIn
    //     ? GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    //     : GRAPHQL_AUTH_MODE.AWS_IAM,
    //   ...graphqlOperation(query, variables),
    // };
    const operation = graphqlOperation(query, variables);
    return (await GraphQLAPI.graphql(operation)) as GraphQLResult<any>;
  }

  public subscription(
    query: string,
    variables?: any
  ): Observable<any> {
    // const operation = {
    //   authMode: this.isSignedIn
    //     ? GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    //     : GRAPHQL_AUTH_MODE.AWS_IAM,
    //   ...graphqlOperation(query, variables),
    // };
    const operation = graphqlOperation(query, variables);
    return GraphQLAPI.graphql(operation) as any;
  }
}
