import {ec} from 'elliptic'
import bs58 from 'bs58'
import bigInt from 'big-integer'

class Key {
    constructor(publicKey = null) {
        this._key = null

        let pub = publicKey === null ? null : Key.decompress(bs58.decode(publicKey))
        // let priv = privateKey === null ? null : bs58.decode(privateKey)

        var ecdsa = new ec('secp256k1')
        // if (priv === null) {
        //     this._key = ecdsa.keyFromPrivate(priv)
        // }
        if (pub !== null) {
            this._key = ecdsa.keyFromPublic(pub)
        }
        // if (priv === null && pub === null) {
        //     this._key = ecdsa.genKeyPair()
        // }
    }

    verify(signature, data) {
        return this._key.verify(data, bs58.decode(signature))
    }

    static decompress(publicKey) {
        let prime = bigInt('115792089210356248762697446949407573530086143415290314195533631308867097853951')
        let pIdent = bigInt('28948022302589062190674361737351893382521535853822578548883407827216774463488')
        let b = bigInt('41058363725152142129326129780047268409114441015993725554835256314039467401291')

        let flag = publicKey[0] - 2
        let x = bigInt(publicKey.slice(1).toString('hex'), 16)
        let y = x.pow(3).minus(x.times(3)).plus(b).modPow(pIdent, prime)
        if (y.mod(2).neq(flag)) {
            y = prime.minus(y)
        }
        return {
            x: x.toString(16),
            y: y.toString(16)
        }
    }
}

export default Key