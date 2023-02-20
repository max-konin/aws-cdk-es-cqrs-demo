import { z } from 'zod';
import { OPEN_ACCOUNT_COMMAND_TYPE } from '../../commands';
import { Command } from '../../framework/command';

export const OpenAccountInput = z.object({
  accountId: z.string(),
  issuer: z.object({
    userId: z.string(),
    userEmail: z.string(),
    tenantId: z.string(),
  }),
});
export type OpenAccountInputType = z.infer<typeof OpenAccountInput>;

export class OpenAccountCommand extends Command<
  'accountId',
  OpenAccountInputType
> {
  commandName = OPEN_ACCOUNT_COMMAND_TYPE;
  identityBy = 'accountId' as const;
  schema = OpenAccountInput;
}
