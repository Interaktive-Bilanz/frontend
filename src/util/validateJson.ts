import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats";
import interactiveBalanceDataSchema from '../schemas/interactive_balance_data.schema.json'
import balanceSheetSchema from '../schemas/balance_sheet.schema.json'
import accountSchema from '../schemas/account.schema.json'
import journalEntrySchema from '../schemas/journal_entry.schema.json'

const ajv = new Ajv2020({
    strict: false,
    allErrors: true,
    allowUnionTypes: true
});
addFormats(ajv);

ajv.addSchema(balanceSheetSchema, 'balance_sheet.schema.json');
ajv.addSchema(accountSchema, 'account.schema.json');
ajv.addSchema(journalEntrySchema, 'journal_entry.schema.json');

export const validateJson = ajv.compile(interactiveBalanceDataSchema);