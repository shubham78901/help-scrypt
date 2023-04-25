import {
    PubKey,
    toHex,
    bsv,
    findSig,
    MethodCallOptions,
    SmartContract,
    assert,
    ContractTransaction,
    hash256,
    method,
    prop,
    Sig, toByteString,
} from 'scrypt-ts'
import { Recallable } from '../../src/contracts/recallable'

import { getDefaultSigner, randomPrivateKey, sleep } from '../utils/helper'
import { myPublicKey } from '../utils/privateKey'

// 3 players, alice, bob, and me
// I am the issuer
const [alicePrivateKey, alicePublicKey, ,] = randomPrivateKey()


const alice_addr = alicePublicKey.toAddress()
console.log("alice address :" + alice_addr)
// contract deploy transaction
let deployTx: bsv.Transaction
// last contract calling transaction
let lastCallTx: bsv.Transaction
let kyc_LastCall: bsv.Transaction
// contract output index
const atOutputIndex = 0

const satoshisIssued = 10
const satoshisSendToAlice = 7
const satoshisSendToBob = 7



export  async function deploy_Normal() {
    await Recallable.compile()
    const Token_Name = "Shubham" + "  SECURITY Token"

    const Protocol_Name = "TimesChain-protocol"

    const Token_Symbol = 'Shubh'

    const Token_supply = 10

    const Data_On_chain = " .........................Token_Name:" + Token_Name + " Protocol_Name:" + Protocol_Name + " Token_Symbol:" + Token_Symbol + " Token_Supply:" + Token_supply + "................................"
    // I am the issuer, and the first user as well
    const initialInstance = new Recallable(PubKey(toHex(myPublicKey)), toByteString(Data_On_chain, true))

    // there is one key in the signer, that is `myPrivateKey` (added by default)
    await initialInstance.connect(getDefaultSigner())

    // I issue 10 re-callable satoshis
    deployTx = await initialInstance.deploy(satoshisIssued)
    console.log(`I issue ${satoshisIssued}: ${deployTx.id}`)

    // the current balance of each player:
    // - me     10 (1 utxo)
    // - alice  0
    // - bob    0
}

describe('Test SmartContract  Recallable  and identity ` on testnet', () => {
    it('should succeed', async () => {
        console.log('Deploy Normal token contract.. ')
        await deploy_Normal()

      

   

    })
})