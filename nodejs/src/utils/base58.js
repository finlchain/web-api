//
const os = require('os');

//
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
let base58_prefix = "FINL";
if (os.hostname().includes('puri'))
{
    base58_prefix = "PURE";
}
else if (os.hostname().includes('finlt'))
{
    base58_prefix = "FINT"; // FINLT
}
else if (os.hostname().includes('finld'))
{
    base58_prefix = "FIND";
}

//
module.exports.addrEncode = (pubkey) => {
    //
    let pubkeyInt = BigInt("0x" + pubkey);

    //
    const carry = BigInt(alphabet.length);
    let r = [];

    while(pubkeyInt > 0n) {
        r.unshift(alphabet[pubkeyInt % carry]);
        pubkeyInt /= carry;
    }

    return base58_prefix + r.join('');
}

//
module.exports.addrDecode = (addr) => {
    //
    if (addr.slice(0,4) === base58_prefix)
    {
        addr = addr.slice(4);
    }

    //
    const carry = BigInt(alphabet.length);
    let total = 0n, base = 1n;
    
    for (let i = addr.length - 1; i >= 0; i--) {
        const n = alphabet.indexOf(addr[i]);
        if (n < 0) return false;
        total += base * BigInt(n);
        base *= carry;
    }

    let pubkey = total.toString('16');
    if(pubkey.length < 66) {
        for (var i = 0; i < 66 - pubkey.length; i++) {
            pubkey = "0" + pubkey;
        }
    }

    return pubkey;
}