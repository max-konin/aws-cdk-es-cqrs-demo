import { z } from 'zod';
import { CREDIT_ACCOUNT_COMMAND_TYPE } from '../../commands';
import { Command } from '../../framework/command';

export const CreditAccountCommandInput = z.object({
  accountId: z.string(),
  amount: z.number().gt(0),
});
export type CreditAccountCommandInputType = z.infer<typeof CreditAccountCommandInput>;

export class CreditAccountCommand extends Command<'accountId', CreditAccountCommandInputType> {
  commandName = CREDIT_ACCOUNT_COMMAND_TYPE;
  identityBy = 'accountId' as const;

  schema = CreditAccountCommandInput
}