export enum CognitoAuthCode {
  UsernameExistsException = 'UsernameExistsException',
  CodeMismatchException = 'CodeMismatchException',
}
export interface ICognitoAuthError {
  message: string;
  code: CognitoAuthCode;
}
