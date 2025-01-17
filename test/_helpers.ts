import fs from 'fs'
import path from 'path'
import { AccountId, Transaction, TransactionId } from '@hashgraph/sdk'

export const defaultAccountNumber = 12345
export const defaultNodeId = 3
export const testUserAccountId = new AccountId(defaultAccountNumber)
export const testNodeAccountId = new AccountId(defaultNodeId)
/** Fixed to a specific timestamp */
export const testTransactionId = TransactionId.fromString(
  `0.0.${defaultAccountNumber}@1691705630.325343432`,
)

type Options = {
  setNodeAccountIds?: boolean
  setTransactionId?: boolean
  freeze?: boolean
  operatorAccountId?: number
}
export function prepareTestTransaction<T extends Transaction = Transaction>(
  transaction: T,
  options?: Options,
): T {
  const selectedOptions: Options = {
    // defaults
    freeze: false,
    setNodeAccountIds: true,
    setTransactionId: true,
    operatorAccountId: defaultAccountNumber,
    // overrides
    ...options,
  }
  if (selectedOptions.setNodeAccountIds) {
    transaction.setNodeAccountIds([testNodeAccountId])
  }
  if (selectedOptions.setTransactionId) {
    let transactionId = testTransactionId
    if (
      selectedOptions.operatorAccountId &&
      selectedOptions.operatorAccountId !== defaultAccountNumber
    ) {
      transactionId = TransactionId.generate(new AccountId(selectedOptions.operatorAccountId))
    }
    transaction.setTransactionId(transactionId)
  }
  if (selectedOptions.freeze) {
    transaction.freeze()
  }
  return transaction
}

// from PrivateKey.generateECDSA().toStringDer()
export const testPrivateKeyECDSA =
  '3030020100300706052b8104000a042204203ce31ffad30d6db47c315bbea08232aad2266d8800a12aa3d8a812486e782759'
// from PrivateKey.generateED25519().toStringDer()
export const testPrivateKeyED25519 =
  '302e020100300506032b657004220420133eefea772add1f995c96bccf42b08b76daf67665f0c4c5ae308fae9275c142'

/** JSON fixture helpers */
const FIXTURES_PATH = 'test/_fixtures'

const filenameWithJsonExtension = (filename: string) => {
  const file = /\.json$/.test(filename) ? filename : filename + '.json'
  return path.join(FIXTURES_PATH, file)
}

export function useJsonFixture(filename: string) {
  const filepath = filenameWithJsonExtension(filename)
  const data = fs.readFileSync(filepath).toString()
  return JSON.parse(data)
}

export function writeJsonFixture(filename: string, data: any) {
  const filepath = filenameWithJsonExtension(filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}
