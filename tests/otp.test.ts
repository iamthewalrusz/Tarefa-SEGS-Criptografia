import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DecimalBinaryConverter,
  BitwiseLogic,
  OtpCipher,
} from '../src/algorithms/otp.ts';

describe('One-Time Pad (OTP) - Atividade 1', () => {
  describe('DecimalBinaryConverter', () => {
    it('deve converter corretamente números decimais para binário', () => {
      assert.equal(DecimalBinaryConverter.toBinary(0), '0');
      assert.equal(DecimalBinaryConverter.toBinary(1), '1');
      assert.equal(DecimalBinaryConverter.toBinary(42), '101010');
      assert.equal(DecimalBinaryConverter.toBinary(255), '11111111');
      assert.equal(DecimalBinaryConverter.toBinary(42, 8), '00101010');
    });

    it('deve converter strings binárias de volta para decimal BigInt', () => {
      assert.equal(DecimalBinaryConverter.toDecimal('0'), 0n);
      assert.equal(DecimalBinaryConverter.toDecimal('1'), 1n);
      assert.equal(DecimalBinaryConverter.toDecimal('101010'), 42n);
      assert.equal(DecimalBinaryConverter.toDecimal('11111111'), 255n);
      assert.equal(DecimalBinaryConverter.toDecimal('00101010'), 42n);
    });

    it('deve lançar RangeError para valores decimais negativos', () => {
      assert.throws(() => DecimalBinaryConverter.toBinary(-5), RangeError);
    });

    it('deve lançar TypeError para strings binárias inválidas', () => {
      assert.throws(() => DecimalBinaryConverter.toDecimal('10201'), TypeError);
      assert.throws(() => DecimalBinaryConverter.toDecimal(''), TypeError);
    });
  });

  describe('BitwiseLogic (XOR)', () => {
    it('deve aplicar XOR bit a bit com precisão', () => {
      const a = '00101010'; // 42
      const b = '00011011'; // 27
      // 42 ^ 27 = 49 (00110001)
      assert.equal(BitwiseLogic.applyXor(a, b), '00110001');
    });

    it('deve lançar erro se os tamanhos de bits forem distintos', () => {
      assert.throws(() => BitwiseLogic.applyXor('101', '1010'), Error);
    });
  });

  describe('OtpCipher - Encriptação e Decriptação', () => {
    it('deve encriptar e decriptar com simetria perfeita (Critérios a, b, c)', () => {
      const mensagem = 42;
      const chave = 27;

      const enc = OtpCipher.encrypt(mensagem, chave);
      assert.equal(enc.plaintextDecimal, 42n);
      assert.equal(enc.keyDecimal, 27n);
      assert.equal(enc.ciphertextDecimal, 49n);
      assert.equal(enc.ciphertextBinary, '110001');

      const dec = OtpCipher.decrypt(enc.ciphertextDecimal, chave);
      assert.equal(dec.recoveredDecimal, 42n);
    });

    it('deve funcionar com números decimais de grande porte (BigInt)', () => {
      const msgGrande = 987654321987654321n;
      const chaveGrande = 123456789123456789n;

      const enc = OtpCipher.encrypt(msgGrande, chaveGrande);
      const dec = OtpCipher.decrypt(enc.ciphertextDecimal, chaveGrande);

      assert.equal(dec.recoveredDecimal, msgGrande);
    });

    it('deve gerar chave aleatória segura com comprimento adequado', () => {
      const msg = 1000;
      const chave = OtpCipher.generateSecureKey(msg);
      assert.ok(chave > 0n);

      const enc = OtpCipher.encrypt(msg, chave);
      const dec = OtpCipher.decrypt(enc.ciphertextDecimal, chave);
      assert.equal(dec.recoveredDecimal, BigInt(msg));
    });

    it('deve rejeitar entradas negativas na encriptação e decriptação', () => {
      assert.throws(() => OtpCipher.encrypt(-10, 20), RangeError);
      assert.throws(() => OtpCipher.encrypt(10, -20), RangeError);
      assert.throws(() => OtpCipher.decrypt(-10, 20), RangeError);
    });
  });
});
