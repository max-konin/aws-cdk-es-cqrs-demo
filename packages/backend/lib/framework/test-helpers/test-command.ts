import { Command } from '../command';

export interface TestCommandWithValidationInputType {
  myId: string;
}

export const TEST_COMMAND = 'TEST_COMMAND_WITH';

export class TestCommand extends Command<
  'myId',
  TestCommandWithValidationInputType
> {
  commandName = TEST_COMMAND;
  identityBy = 'myId' as const;
}
