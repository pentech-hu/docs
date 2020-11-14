'use strict';

const log = (name, value) =>
  console.log(name.padStart(20, ' ') + ': ' + (value || 'falsy').toString());

const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.randomBytes(16).toString('hex'); // set random encryption key
const IV = crypto.randomBytes(8).toString('hex'); // set random initialisation vector

const data = {
  session: crypto.randomBytes(2).toString('hex'),
  user: crypto.randomBytes(2).toString('hex'),
};
const phrase = JSON.stringify(data);
log('ALGORITHM', ALGORITHM);
log('KEY', KEY);
log('IV', IV);
log('phrase', phrase);

/**
 * Encrypts an input string using with the given algorithm, secret key and initialisation vector
 * @param input plain text
 * @returns {string} encrypted string
 */
const encrypt = (input) => {
  let cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  return cipher.update(input, 'utf8', 'base64') + cipher.final('base64');
};

/**
 * Decrypts an encrypted string with the given secret key and initialisation vector
 * @param encrypted
 * @returns {string}
 */
const decrypt = (encrypted) => {
  let decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  return decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
};

let encrypted_key = encrypt(phrase);
log('encrypted_key', encrypted_key);

let url_encoded = encodeURIComponent(encrypted_key);
log('url_encoded', url_encoded);

let url_decoded = decodeURIComponent(url_encoded);
log('url_decoded', url_decoded);

let decoded_phrase = decrypt(url_decoded);
log('decoded_phrase', decoded_phrase);
