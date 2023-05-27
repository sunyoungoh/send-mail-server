import CryptoJS from 'crypto-js';

// 비밀번호 암호화
export const getEncodeKey = key => {
  const encryptCipher = CryptoJS.AES.encrypt(
    key,
    CryptoJS.enc.Utf8.parse(process.env.AES_SECRETKEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.AES_IV),
      padding: CryptoJS.pad.Pkcs7, // default setting(없어도 됨)
      mode: CryptoJS.mode.CBC,
    }
  );
  return encryptCipher.toString();
};

export const getDecodeKey = encryptKey => {
  const decryptChipher = CryptoJS.AES.decrypt(
    encryptKey,
    CryptoJS.enc.Utf8.parse(process.env.AES_SECRETKEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.AES_IV),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );
  return decryptChipher.toString(CryptoJS.enc.Utf8);
};
