/**
 * One-Time Pad (OTP) Cipher Implementation
 *
 * Em conformidade com a Atividade 1 da disciplina de Segurança de Sistemas (JCRSEGS):
 * a) Entrada: mensagem (texto claro) e chave em números no sistema decimal (base 10).
 * b) Saída: mensagem cifrada em sistema decimal (base 10), explicitando a conversão Decimal -> Binária.
 * c) Algoritmo de decriptação da mensagem.
 *
 * Princípios de Clean Code: Responsabilidade Única (SRP), tipagem estrita com BigInt,
 * classes coesas e funções puras sem efeitos colaterais.
 */

export interface OtpEncryptionResult {
  readonly plaintextDecimal: bigint;
  readonly keyDecimal: bigint;
  readonly ciphertextDecimal: bigint;
  readonly plaintextBinary: string;
  readonly keyBinary: string;
  readonly ciphertextBinary: string;
  readonly bitLength: number;
}

export interface OtpDecryptionResult {
  readonly ciphertextDecimal: bigint;
  readonly keyDecimal: bigint;
  readonly recoveredDecimal: bigint;
  readonly ciphertextBinary: string;
  readonly keyBinary: string;
  readonly recoveredBinary: string;
}

/**
 * Converte valores numéricos entre as bases decimal e binária
 * implementando o algoritmo de divisões sucessivas por 2 de forma explícita.
 */
export class DecimalBinaryConverter {
  /**
   * Converte um número decimal inteiro não negativo para uma representação binária.
   * Utiliza o método canônico de divisões sucessivas por 2.
   *
   * @throws {RangeError} Se o valor for negativo.
   */
  public static toBinary(decimalValue: bigint | number, minBits: number = 0): string {
    const value = BigInt(decimalValue);
    if (value < 0n) {
      throw new RangeError("O valor decimal de entrada não pode ser negativo no OTP padrão.");
    }

    if (value === 0n) {
      return "0".padStart(minBits, "0");
    }

    const bits: string[] = [];
    let current = value;

    while (current > 0n) {
      const remainder = current % 2n;
      bits.push(remainder.toString());
      current /= 2n;
    }

    const binaryString = bits.reverse().join("");
    return binaryString.length < minBits ? binaryString.padStart(minBits, "0") : binaryString;
  }

  /**
   * Converte uma string binária para um número inteiro na base decimal (base 10).
   *
   * @throws {TypeError} Se a string contiver caracteres distintos de '0' e '1'.
   */
  public static toDecimal(binaryString: string): bigint {
    const cleanBits = binaryString.trim();
    if (!cleanBits || !/^[01]+$/.test(cleanBits)) {
      throw new TypeError("A cadeia fornecida deve ser uma sequência binária não vazia contendo apenas '0' e '1'.");
    }

    let result = 0n;
    for (let i = 0; i < cleanBits.length; i++) {
      const bit = cleanBits[i] === "1" ? 1n : 0n;
      result = (result << 1n) | bit;
    }

    return result;
  }
}

/**
 * Executa operações de lógica booleana bit a bit em representações binárias.
 */
export class BitwiseLogic {
  /**
   * Aplica a operação XOR (OU exclusivo) bit a bit entre duas sequências binárias de mesmo comprimento.
   *
   * @throws {Error} Se os comprimentos das cadeias forem divergentes.
   */
  public static applyXor(bitsA: string, bitsB: string): string {
    if (bitsA.length !== bitsB.length) {
      throw new Error(`Incompatibilidade de dimensões para XOR: ${bitsA.length} bits vs ${bitsB.length} bits.`);
    }

    const result: string[] = new Array(bitsA.length);
    for (let i = 0; i < bitsA.length; i++) {
      result[i] = bitsA[i] !== bitsB[i] ? "1" : "0";
    }

    return result.join("");
  }
}

/**
 * Motor criptográfico do One-Time Pad (OTP) baseado em números decimais.
 */
export class OtpCipher {
  /**
   * Encripta um valor numérico decimal utilizando uma chave decimal via XOR binário.
   *
   * @param plaintextDecimal - Valor da mensagem em base 10 (inteiro >= 0).
   * @param keyDecimal - Valor da chave em base 10 (inteiro >= 0).
   * @returns Resultado detalhado da encriptação com valores decimais e binários intermediários.
   */
  public static encrypt(
    plaintextDecimal: bigint | number,
    keyDecimal: bigint | number
  ): OtpEncryptionResult {
    const m = BigInt(plaintextDecimal);
    const k = BigInt(keyDecimal);

    if (m < 0n || k < 0n) {
      throw new RangeError("Mensagem e chave devem ser números inteiros decimais não negativos.");
    }

    const rawPlaintextBits = DecimalBinaryConverter.toBinary(m);
    const rawKeyBits = DecimalBinaryConverter.toBinary(k);

    // O comprimento de alinhamento é a quantidade máxima de bits necessária
    const bitLength = Math.max(rawPlaintextBits.length, rawKeyBits.length);

    const plaintextBinary = DecimalBinaryConverter.toBinary(m, bitLength);
    const keyBinary = DecimalBinaryConverter.toBinary(k, bitLength);

    const ciphertextBinary = BitwiseLogic.applyXor(plaintextBinary, keyBinary);
    const ciphertextDecimal = DecimalBinaryConverter.toDecimal(ciphertextBinary);

    return {
      plaintextDecimal: m,
      keyDecimal: k,
      ciphertextDecimal,
      plaintextBinary,
      keyBinary,
      ciphertextBinary,
      bitLength,
    };
  }

  /**
   * Decripta um valor numérico decimal cifrado utilizando a chave decimal via XOR binário.
   *
   * @param ciphertextDecimal - Valor cifrado em base 10.
   * @param keyDecimal - Valor da chave em base 10.
   * @returns Objeto com o valor recuperado em decimal e passos binários.
   */
  public static decrypt(
    ciphertextDecimal: bigint | number,
    keyDecimal: bigint | number
  ): OtpDecryptionResult {
    const c = BigInt(ciphertextDecimal);
    const k = BigInt(keyDecimal);

    if (c < 0n || k < 0n) {
      throw new RangeError("Texto cifrado e chave devem ser números inteiros decimais não negativos.");
    }

    const rawCipherBits = DecimalBinaryConverter.toBinary(c);
    const rawKeyBits = DecimalBinaryConverter.toBinary(k);
    const bitLength = Math.max(rawCipherBits.length, rawKeyBits.length);

    const ciphertextBinary = DecimalBinaryConverter.toBinary(c, bitLength);
    const keyBinary = DecimalBinaryConverter.toBinary(k, bitLength);

    const recoveredBinary = BitwiseLogic.applyXor(ciphertextBinary, keyBinary);
    const recoveredDecimal = DecimalBinaryConverter.toDecimal(recoveredBinary);

    return {
      ciphertextDecimal: c,
      keyDecimal: k,
      recoveredDecimal,
      ciphertextBinary,
      keyBinary,
      recoveredBinary,
    };
  }

  /**
   * Gera uma chave criptográfica aleatória com a mesma quantidade de bits da mensagem.
   */
  public static generateSecureKey(forMessageDecimal: bigint | number): bigint {
    const msg = BigInt(forMessageDecimal);
    const bitsNeeded = Math.max(1, DecimalBinaryConverter.toBinary(msg).length);

    let randomBits = "";
    for (let i = 0; i < bitsNeeded; i++) {
      randomBits += Math.random() < 0.5 ? "0" : "1";
    }

    // Garante que o bit mais significativo não seja zero para chaves de comprimento completo
    if (randomBits[0] === "0") {
      randomBits = "1" + randomBits.slice(1);
    }

    return DecimalBinaryConverter.toDecimal(randomBits);
  }
}
