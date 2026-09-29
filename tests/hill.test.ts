import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ModularArithmetic,
  ModularMatrix,
  HillCipher,
  NonInvertibleKeyError,
} from '../src/algorithms/hill.ts';

describe('Cifra de Hill - Atividade 4', () => {
  describe('ModularArithmetic', () => {
    it('deve calcular MDC e inverso modular corretamente', () => {
      assert.equal(ModularArithmetic.gcd(9, 26), 1);
      assert.equal(ModularArithmetic.gcd(4, 26), 2);
      assert.equal(ModularArithmetic.gcd(13, 26), 13);

      // 9 * 3 = 27 = 1 mod 26
      assert.equal(ModularArithmetic.modInverse(9, 26), 3);
      // 15 * 7 = 105 = 4*26 + 1 = 1 mod 26
      assert.equal(ModularArithmetic.modInverse(15, 26), 7);
      // 25 * 25 = 625 = 24*26 + 1 = 1 mod 26
      assert.equal(ModularArithmetic.modInverse(25, 26), 25);
    });

    it('deve lançar erro se o inverso modular não existir', () => {
      assert.throws(() => ModularArithmetic.modInverse(4, 26), /Não existe inverso/);
      assert.throws(() => ModularArithmetic.modInverse(13, 26), /Não existe inverso/);
    });
  });

  describe('ModularMatrix', () => {
    it('deve calcular determinante de matriz 2x2 e 3x3', () => {
      // 2x2: [[3, 3], [2, 5]] -> det = 15 - 6 = 9
      const m2 = [
        [3, 3],
        [2, 5],
      ];
      assert.equal(ModularMatrix.determinant(m2), 9);

      // 3x3: [[1, 2, 3], [0, 1, 4], [5, 6, 0]]
      // det = 1*(0 - 24) - 2*(0 - 20) + 3*(0 - 5) = -24 + 40 - 15 = 1
      const m3 = [
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ];
      assert.equal(ModularMatrix.determinant(m3), 1);
    });

    it('deve calcular a matriz inversa modular K^-1 tal que K * K^-1 = I (mod 26)', () => {
      const k = [
        [3, 3],
        [2, 5],
      ];
      const inv = ModularMatrix.inverse(k, 26);

      // Multiplicação k * inv
      const r00 = ModularArithmetic.mod(k[0][0] * inv[0][0] + k[0][1] * inv[1][0], 26);
      const r01 = ModularArithmetic.mod(k[0][0] * inv[0][1] + k[0][1] * inv[1][1], 26);
      const r10 = ModularArithmetic.mod(k[1][0] * inv[0][0] + k[1][1] * inv[1][0], 26);
      const r11 = ModularArithmetic.mod(k[1][0] * inv[0][1] + k[1][1] * inv[1][1], 26);

      assert.equal(r00, 1);
      assert.equal(r01, 0);
      assert.equal(r10, 0);
      assert.equal(r11, 1);
    });

    it('deve lançar NonInvertibleKeyError para matrizes com det não coprimo a 26', () => {
      // Matriz cujo det é par: [[2, 0], [0, 2]] -> det = 4
      const mPar = [
        [2, 0],
        [0, 2],
      ];
      assert.throws(() => ModularMatrix.inverse(mPar, 26), NonInvertibleKeyError);

      // Matriz cujo det é múltiplo de 13: [[13, 0], [0, 1]] -> det = 13
      const m13 = [
        [13, 0],
        [0, 1],
      ];
      assert.throws(() => ModularMatrix.inverse(m13, 26), NonInvertibleKeyError);
    });
  });

  describe('HillCipher - Encriptação e Decriptação', () => {
    it('deve encriptar e decriptar com matriz 2x2 com simetria completa', () => {
      // Chave 2x2 clássica: [[3, 3], [2, 5]]
      const key = [
        [3, 3],
        [2, 5],
      ];
      const msg = 'HELP';

      const enc = HillCipher.encrypt(msg, key);
      assert.equal(enc.ciphertext.length, 4);

      const dec = HillCipher.decrypt(enc.ciphertext, key);
      assert.equal(dec, 'HELP');
    });

    it('deve aceitar chave em formato de palavra textual (ex: 4 letras para 2x2)', () => {
      // "DDCF" -> [[3, 3], [2, 5]] (D=3, D=3, C=2, F=5)
      const enc = HillCipher.encrypt('CRIPTO', 'DDCF');
      const dec = HillCipher.decrypt(enc.ciphertext, 'DDCF');
      assert.equal(dec, 'CRIPTO');
    });

    it('deve aplicar padding "X" quando o comprimento for ímpar em matriz 2x2', () => {
      const enc = HillCipher.encrypt('OLA', 'DDCF');
      assert.equal(enc.paddingCount, 1);
      assert.equal(enc.plaintextFormatted, 'OLAX');

      const dec = HillCipher.decrypt(enc.ciphertext, 'DDCF');
      assert.equal(dec, 'OLAX');
    });

    it('deve encriptar e decriptar com matriz 3x3', () => {
      // Matriz 3x3 inversível mod 26: det = 1
      const key3x3 = [
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ];
      const msg = 'SEGURANCA';

      const enc = HillCipher.encrypt(msg, key3x3);
      const dec = HillCipher.decrypt(enc.ciphertext, key3x3);

      assert.equal(dec, 'SEGURANCA');
    });

    it('deve lançar erro se a mensagem não tiver letras alfabéticas', () => {
      assert.throws(() => HillCipher.encrypt('123456', 'DDCF'), /ao menos uma letra alfabética/);
    });

    it('deve lançar erro se a chave em texto não for quadrado perfeito', () => {
      assert.throws(() => HillCipher.parseKey('ABCDE'), /não forma um quadrado perfeito/);
    });
  });
});
