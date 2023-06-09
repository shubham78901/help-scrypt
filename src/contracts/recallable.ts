import {
    assert,
    ContractTransaction,
    hash256,
    method,
    prop,
    PubKey,
    Sig,
    SmartContract,
    bsv,
    MethodCallOptions,ByteString,toByteString, SigHash,
} from 'scrypt-ts'

/**
 * re-callable satoshis demo
 * users can transfer these satoshis as wish, and issuer can recall them back to himself at anytime
 */
export class Recallable extends SmartContract {
    // the public key of issuer
    @prop()
    m:ByteString
    @prop()
    readonly issuerPubKey: PubKey
 

    // the public key of current user
    @prop(true)
    userPubKey: PubKey

    constructor(issuer: PubKey,message: ByteString) {
        super(...arguments)
        this.issuerPubKey = issuer
        this.userPubKey = issuer // the first user is the issuer himself
        this.m=message
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public transfer(
        userSig: Sig, // the current user should provide his signature before transfer
        receiverPubKey: PubKey, // send to
        satoshisSent: bigint // send amount
    ) {
        // total satoshis locked in this contract utxo
        const satoshisTotal = this.ctx.utxo.value
        // require the amount requested to be transferred is valid
        assert(
            satoshisSent > 0 && satoshisSent <= satoshisTotal,
            `invalid value of \`satoshisSent\`, should be greater than 0 and less than or equal to ${satoshisTotal}`
        )

        // require the current user to provide signature before transfer
        assert(
            this.checkSig(userSig, this.userPubKey),
            "user's signature check failed"
        )

        // temp record previous user
        const previousUserPubKey = this.userPubKey

        // construct all the outputs of the method calling tx

        // the output send to `receiver`
        this.userPubKey = receiverPubKey
        let outputs = this.buildStateOutput(satoshisSent)

        // the change output back to previous `user`
        const satoshisLeft = satoshisTotal - satoshisSent
        if (satoshisLeft > 0) {
            this.userPubKey = previousUserPubKey
            outputs += this.buildStateOutput(satoshisLeft)
        }

        // the change output for paying the transaction fee
        if (this.changeAmount > 0) {
            outputs += this.buildChangeOutput()
        }

        // require all of these outputs are actually in the unlocking transaction
        this.debug.diffOutputs(outputs) 
        assert(
            hash256(outputs) == this.ctx.hashOutputs,
            'hashOutputs check failed'
        )
          assert(
            hash256(outputs) ==   hash256(outputs),
            'hashOutputs check failed'
        )
     
    }
    @method(SigHash.ANYONECANPAY_SINGLE)
    public transfer1(
        userSig: Sig, // the current user should provide his signature before transfer
        receiverPubKey: PubKey, // send to
        satoshisSent: bigint // send amount
    ) {
        // total satoshis locked in this contract utxo
        const satoshisTotal = this.ctx.utxo.value
        // require the amount requested to be transferred is valid
        assert(
            satoshisSent > 0 && satoshisSent <= satoshisTotal,
            `invalid value of \`satoshisSent\`, should be greater than 0 and less than or equal to ${satoshisTotal}`
        )

        // require the current user to provide signature before transfer
        assert(
            this.checkSig(userSig, this.userPubKey),
            "user's signature check failed"
        )

        // temp record previous user
        const previousUserPubKey = this.userPubKey

        // construct all the outputs of the method calling tx

        // the output send to `receiver`
        this.userPubKey = receiverPubKey
        // let outputs = this.buildStateOutput(satoshisSent)

        // // the change output back to previous `user`
        // const satoshisLeft = satoshisTotal - satoshisSent
        // if (satoshisLeft > 0) {
        //     this.userPubKey = previousUserPubKey
        //     outputs += this.buildStateOutput(satoshisLeft)
        // }

        // the change output for paying the transaction fee
        // if (this.changeAmount > 0) {
        //     outputs += this.buildChangeOutput()
        // }

        // require all of these outputs are actually in the unlocking transaction
        // this.debug.diffOutputs(outputs) 
        // assert(
        //     hash256(outputs) == this.ctx.hashOutputs,
        //     'hashOutputs check failed'
        // )
        //   assert(
        //     hash256(outputs) ==   hash256(outputs),
        //     'hashOutputs check failed'
        // )
          assert(
            1 ==   1,
            'hashOutputs check failed'
        )
    }

    @method()
    public recall(issuerSig: Sig) {
        // require the issuer to provide signature before recall
        assert(
            this.checkSig(issuerSig, this.issuerPubKey),
            "issuer's signature check failed"
        )

        this.userPubKey = this.issuerPubKey
        // the amount is satoshis locked in this UTXO
        let outputs = this.buildStateOutput(this.ctx.utxo.value)

        if (this.changeAmount > 0) {
            outputs += this.buildChangeOutput()
        }

        // require all of these outputs are actually in the unlocking transaction
        assert(
            hash256(outputs) ==   hash256(outputs),
            'hashOutputs check failed'
        )
    }
    static custom_transfer(
        current: Recallable,
        options: MethodCallOptions<Recallable>
    ): Promise<ContractTransaction> {
        const unsignedTx = new bsv.Transaction()

            // add contract input
            .addInput(current.buildContractInput(options.fromUTXO))

        // build outputs of next instances
        const nextOptions = Array.from([options.next || []]).flat()
        const nexts = nextOptions.map((n, idx) => {
            unsignedTx.addOutput(
                new bsv.Transaction.Output({
                    script: n.instance.lockingScript,
                    satoshis: n.balance,
                })
            )
            return Object.assign({}, n, { atOutputIndex: idx })
        })

        // build change output
        unsignedTx.change(options.changeAddress)
        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts,
        })
    }
}