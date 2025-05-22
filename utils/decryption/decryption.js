import cryptoJS from "crypto-js";
export function decodeData(data) {
  const bytes = cryptoJS.AES.decrypt(
    data,
    process.env.NEXT_PUBLIC_FE_ENCRYPT_SEC_KEY
  );
  const plainData = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
  return plainData;
}
