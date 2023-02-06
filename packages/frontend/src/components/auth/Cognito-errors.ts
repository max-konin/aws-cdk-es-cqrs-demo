export enum CognitoAuthCode {
  UsernameExistsException = 'UsernameExistsException',
  CodeMismatchException = 'CodeMismatchException',
  UserNotConfirmedException = 'UserNotConfirmedException',
}
export interface ICognitoAuthError {
  message: string;
  code: CognitoAuthCode;
}
