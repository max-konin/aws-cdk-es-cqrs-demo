import { Command } from '../command';
import { z } from 'zod';

export const TestCommandWithValidationInput = z.object({
  myId: z.string(),
});

export type TestCommandWithValidationInputType = z.infer<
  typeof TestCommandWithValidationInput
>;

export const TEST_COMMAND_WITH_VALIDATION = 'TEST_COMMAND_WITH_VALIDATION';

export class TestCommandWithValidation extends Command<
  'myId',
  TestCommandWithValidationInputType
> {
  commandName = TEST_COMMAND_WITH_VALIDATION;
  schema = TestCommandWithValidationInput;
  identityBy = 'myId' as const;
}
