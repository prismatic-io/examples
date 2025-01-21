import type {
  CipherAlgorithm,
  CompressionAlgorithm,
  KexAlgorithm,
  MacAlgorithm,
  ServerHostKeyAlgorithm,
} from "ssh2";

export const kexAlgorithms = [
  "curve25519-sha256",
  "curve25519-sha256@libssh.org",
  "ecdh-sha2-nistp256",
  "ecdh-sha2-nistp384",
  "ecdh-sha2-nistp521",
  "diffie-hellman-group-exchange-sha256",
  "diffie-hellman-group14-sha256",
  "diffie-hellman-group15-sha512",
  "diffie-hellman-group16-sha512",
  "diffie-hellman-group17-sha512",
  "diffie-hellman-group18-sha512",
  "diffie-hellman-group-exchange-sha1",
  "diffie-hellman-group14-sha1",
  "diffie-hellman-group1-sha1",
] as KexAlgorithm[];

export const serverHostKeyAlgorithms = [
  "ssh-ed25519",
  "ecdsa-sha2-nistp256",
  "ecdsa-sha2-nistp384",
  "ecdsa-sha2-nistp521",
  "rsa-sha2-512",
  "rsa-sha2-256",
  "ssh-rsa",
  "ssh-dss",
] as ServerHostKeyAlgorithm[];

export const compressionAlgorithms = [
  "none",
  "zlib",
  "zlib@openssh.com",
] as CompressionAlgorithm[];

export const secureCipherAlgorithms = [
  "chacha20-poly1305@openssh.com",
  "aes128-gcm@openssh.com",
  "aes256-gcm@openssh.com",
  "aes128-ctr",
  "aes192-ctr",
  "aes256-ctr",
] as CipherAlgorithm[];

export const unsecureCipherAlgorithms = ["aes256-cbc"] as CipherAlgorithm[];

export const hmacAlgorithms = [
  "hmac-sha2-256-etm@openssh.com",
  "hmac-sha2-512-etm@openssh.com",
  "hmac-sha1-etm@openssh.com",
  "hmac-sha2-256",
  "hmac-sha2-512",
  "hmac-sha1",
  "hmac-md5",
  "hmac-sha2-256-96",
  "hmac-sha2-512-96",
  "hmac-ripemd160",
  "hmac-sha1-96",
  "hmac-md5-96",
] as MacAlgorithm[];
