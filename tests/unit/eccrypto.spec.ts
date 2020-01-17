var eccrypto = require("eccrypto");
const log = require("debug")("unit-test");

describe.skip("utils/crypt.ts", () => {
  it("maxPrivateKey", () => {
    log(eccrypto);
    log(typeof eccrypto.generatePrivate);
    var privateKeyA = Buffer.from(
      "574571C6932299B7C367338674036171AF0214ADDCD7C984A4DFB3A885058284",
      "hex"
    );
    var publicKeyA = Buffer.from(
      "04b580e089e5f85648aa82cbd2265da63b1ab6d2a43f3de961daa552d36c5fe9d940fdb7235109aa83b16f41cb33971e99ef648fbe5e197c82a13f8baf8acf2ba4",
      "hex"
    );
    var privateKeyB = Buffer.from(
      "42E6995FC4163352794EC03784E6B33BF194D477F267D393B3932CCCD80110E0",
      "hex"
    );
    var publicKeyB = Buffer.from(
      "04c6a8bfd10f44ebc950f01404322601a6accf3bdb90588fbfc057418dbe2cfd853b7176e1ac985b510f66bdd8855ceca35efb84077a05ba32485654e45b984d80",
      "hex"
    );

    // Encrypting the message for B.
    eccrypto
      .encrypt(publicKeyB, Buffer.from("msg to b"))
      .then(function(encrypted: any) {
        // B decrypting the message.
        eccrypto.decrypt(privateKeyB, encrypted).then(function(plaintext: any) {
          console.log("Message to part B:", plaintext.toString());
          expect(plaintext.toString()).toMatch("msg to b");
        });
      })
      .catch((e: any) => {
        log(e);
      });

    // Encrypting the message for A.
    eccrypto
      .encrypt(publicKeyA, Buffer.from("msg to a"))
      .then(function(encrypted: any) {
        // A decrypting the message.
        eccrypto.decrypt(privateKeyA, encrypted).then(function(plaintext: any) {
          console.log("Message to part A:", plaintext.toString());
          expect(plaintext.toString()).toMatch("msg to a");
        });
      })
      .catch((e: any) => {
        log(e);
      });
  });
});
