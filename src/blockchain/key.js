import bitcoin from 'bitcoinjs-lib'
import bs58 from 'bs58'
import secp256k1 from 'secp256k1'
import createHash from 'create-hash'

class Key {
    keyPair = null

    static fromWIF(wif) {
        var key = new Key(false)
        key.keyPair = bitcoin.ECPair.fromWIF(wif)
        return key
    }

    static getAddress(publicKey) {
        const { address } = bitcoin.payments.p2pkh({ pubkey: bs58.decode(publicKey) })
        return address
    }

    static encodeSignature(signature, recovery, compressed) {
        if (compressed) recovery += 4
        return Buffer.concat([Buffer.alloc(1, recovery + 27), signature])
    }

    static decodeSignature(buffer) {
        if (buffer.length !== 65) throw new Error('Invalid signature length')

        var flagByte = buffer.readUInt8(0) - 27
        if (flagByte > 7) throw new Error('Invalid signature parameter')

        return {
            compressed: !!(flagByte & 4),
            recovery: flagByte & 3,
            signature: buffer.slice(1)
        }
    }

    toWIF() {
        return this.keyPair.toWIF()
    }

    toAddress() {
        const { address } = bitcoin.payments.p2pkh({ pubkey: this.keyPair.publicKey })
        return address
    }

    constructor(gen = true) {
        if (gen) {
            this.keyPair = bitcoin.ECPair.makeRandom()
        }
    }

    publicKey() {
        return bs58.encode(this.keyPair.publicKey).toString()
    }

    sign(message) {
        var signature = secp256k1.sign(createHash('sha256').update(message).digest(), this.keyPair.privateKey)
        return bs58.encode(Key.encodeSignature(signature.signature, signature.recovery, true)).toString()
    }

    static recoverAddress(signature,message)
    {
        let hash = createHash('sha256').update(message).digest()
        if (!Buffer.isBuffer(signature)) signature = bs58.decode(signature)
        let sig = Key.decodeSignature(signature)
        let publicKey = bs58.encode(secp256k1.recover(hash, sig.signature, sig.recovery, true)).toString()
        let address= Key.getAddress(publicKey)
        return address
    }
}

export default Key
