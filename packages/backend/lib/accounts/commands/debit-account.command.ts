import { z } from 'zod';
import { DEBIT_ACCOUNT_COMMAND_TYPE } from '../../commands';
import { Command } from '../../framework/command';

export const DebitAccountCommandInput = z.object({
  accountId: z.string(),
  amount: z.number().gt(0),
});
export type DebitAccountCommandInputType = z.infer<typeof DebitAccountCommandInput>;

export class DebitAccountCommand extends Command<'accountId', DebitAccountCommandInputType> {
  commandName = DEBIT_ACCOUNT_COMMAND_TYPE;
  identityBy = 'accountId' as const;

  schema = DebitAccountCommandInput
}