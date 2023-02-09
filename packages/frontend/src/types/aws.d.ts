declare module 'aws-amplify' {
  import { GraphQLResult } from '@aws-amplify/api-graphql';
  import { Observable } from '@apollo/client';

  interface UserAttributes {
    email: string;
    email_verified: true;
    sub: string;
  }

  interface UserInfo {
    id: number;
    username: string;
    attributes: UserAttributes;
  }

  interface CognitoUser {
    username: string;
    attributes: UserAttributes;
    Session?: unknown;
    authenticationFlowType: string;
    client: unknown;
    keyPrefix: string;
    pool: unknown;
    preferredMFA: string;
    signInUserSession: unknown;
    storage: unknown;
    userDataKey: string;
  }

  interface UsernamePasswordOpts {
    username: string;
    password: string;
  }

  interface Auth {
    configure(config?: unknown): AuthOptions;
    confirmSignUp(username: string, code: string): Promise<unknown>;
    currentUserInfo(): Promise<UserInfo | null>;
    deleteUser(): Promise<string | void>;
    resendSignUp(username: string): Promise<unknown>;
    signIn(
      usernameOrSignInOpts: string | UsernamePasswordOpts,
      pw?: string
    ): Promise<CognitoUser>;
    signOut(): Promise<void>;
    signUp(
      params: string | SignUpParams,
      ...restOfAttrs: string[]
    ): Promise<ISignUpResult>;
  }

  interface HubCapsule {
    channel: string;
    patternInfo?: string[];
    payload: {
      data?: unknown;
      event: string;
      message?: string;
    };
    source: string;
  }

  type HubCallback = (capsule: HubCapsule) => void;
  interface Hub {
    listen(
      channel: string | RegExp,
      callback?: HubCallback,
      listenerName?: string
      // eslint-disable-next-line @typescript-eslint/ban-types
    ): Function;
  }

  interface AmplifyConfig {
    [option: string]: unknown;
    Auth: Record<string, unknown>;
  }

  interface Amplify {
    configure(config: AmplifyConfig): void;
  }

  interface GraphQLOptions {
    authMode?: unknown;
    authToken?: string;
    query: string;
    userAgentSuffix?: string;
    variables?: object;
  }

  interface API {
    graphql<T>(
      options: GraphQLOptions,
      additionalHeaders?: object
    ): T extends GraphQLQuery<T>
      ? Promise<GraphQLResult<T>>
      : T extends GraphQLSubscription<T>
      ? Observable<object>
      : Promise<GraphQLResult<unknown>> | Observable<object>;
  }

  interface AWS {
    Auth: Auth;
    Hub: Hub;
    Amplify: Amplify;
    API: API;
    graphqlOperation: (subscription: string, variables?: any) => GraphQLOptions;
  }

  const aws: AWS;
  export = aws;
}
