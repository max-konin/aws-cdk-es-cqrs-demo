export enum CognitoAuthCode {
  UsernameExistsException = 'UsernameExistsException',
  CodeMismatchException = 'CodeMismatchException',
  UserNotConfirmedException = 'UserNotConfirmedException',
  InvalidPasswordException = 'InvalidPasswordException',
}
export interface ICognitoAuthError {
  message: string;
  code: CognitoAuthCode;
}
