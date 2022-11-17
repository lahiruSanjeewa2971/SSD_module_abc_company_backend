const crypto = require('crypto');

const user = crypto.createECDH('secp256k1');
user.generateKeys();

const manager = crypto.createECDH('secp256k1');
manager.generateKeys();

const userPublicKeyBase64 = user.getPublicKey().toString('base64');
const managerPublicKeyBase64 = manager.getPublicKey().toString('base64');

const userSharedKey = user.computeSecret(managerPublicKeyBase64, 'base64', 'hex');
const managerSharedKey = manager.computeSecret(userPublicKeyBase64, 'base64', 'hex');

console.log(userSharedKey === managerSharedKey);
console.log('User shared Key: ', userSharedKey);
console.log('Manager shared Key: ', managerSharedKey);

const MESSAGE = 'this is some random message...';

const IV = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(
  'aes-256-gcm',
  Buffer.from(userSharedKey, 'hex'),
  IV
);

let encrypted = cipher.update(MESSAGE, 'utf8', 'hex');
encrypted += cipher.final('hex');

const auth_tag = cipher.getAuthTag().toString('hex');

console.table({
  IV: IV.toString('hex'),
  encrypted: encrypted,
  auth_tag: auth_tag
});

const payload = IV.toString('hex') + encrypted + auth_tag;

const payload64 = Buffer.from(payload, 'hex').toString('base64');
console.log(payload64);

//Manager will do from here
const manager_payload = Buffer.from(payload64, 'base64').toString('hex');

const manager_iv = manager_payload.substr(0, 32);
const manager_encrypted = manager_payload.substr(32, manager_payload.length - 32 - 32);
const manager_auth_tag = manager_payload.substr(manager_payload.length - 32, 32);

console.table({ manager_iv, manager_encrypted, manager_auth_tag });

try {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(managerSharedKey, 'hex'),
    Buffer.from(manager_iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(manager_auth_tag, 'hex'));

  let decrypted = decipher.update(manager_encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  console.table({ DecyptedMessage: decrypted });
} catch (error) {
  console.log(error.message);
}