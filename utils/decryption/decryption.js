import CryptoJS from "crypto-js";
export function decrypt(encryptedWithIv, SECRET_KEY) {
  const [ivBase64, encryptedBase64] = encryptedWithIv.split(":");

  const iv = CryptoJS.enc.Base64.parse(ivBase64);
  const key = CryptoJS.SHA256(SECRET_KEY);

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
