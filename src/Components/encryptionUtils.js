import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "your-encryption-key";

export const encryptToken = (token) => {
  const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  return encryptedToken;
};

export const decryptToken = (encryptedToken) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
};
