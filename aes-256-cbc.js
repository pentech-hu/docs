'use strict';

const log = (name, value) =>
  console.log(name.padStart(20, ' ') + ': ', (value || 'falsy'));

const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.randomBytes(16).toString('hex'); // set random encryption key

const data = {
  session: crypto.randomBytes(2).toString('hex'),
  user: crypto.randomBytes(2).toString('hex'),
};
log('ALGORITHM', ALGORITHM);
log('KEY', KEY);
console.log('–'.repeat(60));

log('original data', data);

const phrase = JSON.stringify(data);
log('original JSON', phrase);

/**
 * Encrypts an input string using with the given algorithm, secret key
 * @param input plain text
 * @param algorithm to be used for encryption
 * @param key secret key for encryption
 * @returns {string} encrypted string
 */
const encrypt = (input, algorithm, key) => {
  const initialisationVector = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv(algorithm, key, initialisationVector);
  return `${cipher.update(input, 'utf8', 'base64') + cipher.final('base64')}:${initialisationVector}`;
};

/**
 * Decrypts an encrypted string with the given secret key
 * @param encrypted
 * @param algorithm to be used for encryption
 * @param key secret key for encryption
 * @returns {string} decrypted plain text
 */
const decrypt = (encrypted, algorithm, key) => {
  const [encoded, initialisationVector] = encrypted.split(':');
  let decipher = crypto.createDecipheriv(algorithm, key, initialisationVector);
  return decipher.update(encoded, 'base64', 'utf8') + decipher.final('utf8');
};

let encrypted = encrypt(phrase, ALGORITHM, KEY);
log('encrypted', encrypted);

let urlEncoded = encodeURIComponent(encrypted);
log('url encoded', urlEncoded);

let urlDecoded = decodeURIComponent(urlEncoded);
log('url decoded', urlDecoded);

let decodedPhrase = decrypt(urlDecoded, ALGORITHM, KEY);
log('decoded JSON', decodedPhrase);

let decoded = JSON.parse(decodedPhrase);
log('decoded data', decoded);
