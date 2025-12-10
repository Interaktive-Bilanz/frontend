import Ajv, { JSONSchemaType } from "ajv"
import interactiveBalanceDataSchema from '../schemas/interactive_balance_data.json'
import balanceSheetSchema from '../schemas/balance_sheet.json'
import accountSchema from '../schemas/account.json'
import journalEntrySchema from '../schemas/journal_entry.json'

const ajv = new Ajv({ strict: false });

ajv.addSchema(balanceSheetSchema, 'balance_sheet.json');
ajv.addSchema(accountSchema, 'account.json');
ajv.addSchema(journalEntrySchema, 'journal_entry.json');
ajv.addSchema(interactiveBalanceDataSchema, 'interactive_balance_data.json');

export const validateJson = ajv.compile(interactiveBalanceDataSchema);