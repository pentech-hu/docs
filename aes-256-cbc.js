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
 * @returns {string} encrypted string
 */
const encrypt = (input) => {
  const initialisationVector = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv(ALGORITHM, KEY, initialisationVector);
  return `${cipher.update(input, 'utf8', 'base64') + cipher.final('base64')}:${initialisationVector}`;
};

/**
 * Decrypts an encrypted string with the given secret key
 * @param encrypted
 * @returns {string} decrypted plain text
 */
const decrypt = (encrypted) => {
  const [encoded, initialisationVector] = encrypted.split(':');
  let decipher = crypto.createDecipheriv(ALGORITHM, KEY, initialisationVector);
  return decipher.update(encoded, 'base64', 'utf8') + decipher.final('utf8');
};

let encrypted = encrypt(phrase);
log('encrypted', encrypted);

let urlEncoded = encodeURIComponent(encrypted);
log('url encoded', urlEncoded);

let urlDecoded = decodeURIComponent(urlEncoded);
log('url decoded', urlDecoded);

let decodedPhrase = decrypt(urlDecoded);
log('decoded JSON', decodedPhrase);

let decoded = JSON.parse(decodedPhrase);
log('decoded data', decoded);

/*  

Example output:

           ALGORITHM:  aes-256-cbc
                 KEY:  ff822270efbbb07773c48ea81c90120f
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
       original data:  { session: '1ec0', user: 'eadc' }
       original JSON:  {"session":"1ec0","user":"eadc"}
           encrypted:  tPgImxgyvYm24bXOwKPDyz/U3RLUsBC7tMEubztjklAMmzT1Bb+Gzo+kmKQkf/G4:6b151156943e0dea
         url encoded:  tPgImxgyvYm24bXOwKPDyz%2FU3RLUsBC7tMEubztjklAMmzT1Bb%2BGzo%2BkmKQkf%2FG4%3A6b151156943e0dea
         url decoded:  tPgImxgyvYm24bXOwKPDyz/U3RLUsBC7tMEubztjklAMmzT1Bb+Gzo+kmKQkf/G4:6b151156943e0dea
        decoded JSON:  {"session":"1ec0","user":"eadc"}
        decoded data:  { session: '1ec0', user: 'eadc' }
*/
