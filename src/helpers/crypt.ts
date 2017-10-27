import zlib = require('zlib');
import crypto = require('crypto');
import URLSafeBase64 = require('urlsafe-base64');

export function encrypt(data: {}, password: string, saltBytes: number = 32): string {
    // Make JSON
    let jdata = JSON.stringify(data);
    // Compress data w/ GZip
    let gzip = zlib.gzipSync(jdata);
    // Salt - this is to prevent attacking the encryption by passing a known payload.
    let salt = crypto.randomBytes(saltBytes);
    let buffer = Buffer.concat([salt, gzip]);
    // Encrypt - urlCrypt.password has 256 bits of randomness
    let cipher = crypto.createCipher('aes-256-cbc', password);
    buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
    // Encode as urlSafeBase64
    let ret = URLSafeBase64.encode(buffer);
    return ret;
}

export function decrypt(data: string, password: string, saltBytes: number = 32): {} {
    // Decode
    let buffer = URLSafeBase64.decode(data);
    // Decrypt
    let decipher = crypto.createDecipher('aes-256-cbc', password);
    buffer = Buffer.concat([decipher.update(buffer), decipher.final()]);
    // Remove and discard salt
    buffer = buffer.slice(saltBytes);
    // Decompress
    buffer = zlib.gunzipSync(buffer);
    // convert to buffer to string
    let str = buffer.toString('utf8');
    // Parse and return
    let ret = JSON.parse(str);
    return ret;
}