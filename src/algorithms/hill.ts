/**
 * Cifra de Hill (Álgebra Linear Modular sobre Z_26)
 *
 * Em conformidade com a Atividade 4 da disciplina de Segurança de Sistemas (JCRSEGS):
 * a) A mensagem e a chave poderão ser uma palavra ou chave (matriz).
 * b) Algoritmo de decriptação baseado na matriz inversa modular.
 *
 * Princípios de Clean Code: Responsabilidade Única (SRP), imutabilidade, modularidade matemática,
 * tratamento expressivo de matrizes singulares modulo 26 e tipagem estrita.
 */

export interface HillBlockTransformation {
  readonly blockIndex: number;
  readonly inputChars: string;
  readonly inputVector: readonly number[];
  readonly outputVector: readonly number[];
  readonly outputChars: string;
}

export interface HillEncryptionResult {
  readonly plaintextFormatted: string;
  readonly ciphertext: string;
  readonly dimension: number;
  readonly keyMatrix: readonly (readonly number[])[];
  readonly inverseKeyMatrix: readonly (readonly number[])[];
  readonly determinant: number;
  readonly modularInverseDeterminant: number;
  readonly paddingCount: number;
  readonly blockTransformations: readonly HillBlockTransformation[];
}

export class NonInvertibleKeyError extends Error {
  public readonly determinant: number;
  public readonly gcdValue: number;

  constructor(determinant: number, gcdValue: number) {
    super(
      `A matriz de chave informada não é inversível em Z_26. ` +
        `Determinante = ${determinant} (mod 26 = ${((determinant % 26) + 26) % 26}), mdc(det, 26) = ${gcdValue}. ` +
        `Para ser inversível, o determinante deve ser coprimo com 26 (isto é, não pode ser par nem múltiplo de 13).`
    );
    this.name = "NonInvertibleKeyError";
    this.determinant = determinant;
    this.gcdValue = gcdValue;
  }
}

/**
 * Operações fundamentais de aritmética modular sobre o anel dos inteiros.
 */
export class ModularArithmetic {
  public static readonly ALPHABET_SIZE = 26;

  /**
   * Operador módulo matemático canônico (sempre retorna valor no intervalo [0, m - 1]).
   */
  public static mod(n: number, m: number = ModularArithmetic.ALPHABET_SIZE): number {
    const r = n % m;
    return r < 0 ? r + m : r;
  }

  /**
   * Calcula o Máximo Divisor Comum (MDC) pelo algoritmo de Euclides.
   */
  public static gcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  }

  /**
   * Executa o Algoritmo de Euclides Estendido: encontra inteiros x e y tais que a*x + b*y = mdc(a, b).
   */
  public static extendedGcd(
    a: number,
    b: number
  ): { gcd: number; x: number; y: number } {
    if (b === 0) {
      return { gcd: a, x: 1, y: 0 };
    }
    const { gcd, x: x1, y: y1 } = this.extendedGcd(b, a % b);
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    return { gcd, x, y };
  }

  /**
   * Calcula o inverso multiplicativo modular de 'a' no módulo 'm'.
   * Encontra x tal que (a * x) = 1 (mod m).
   *
   * @throws {Error} Caso 'a' e 'm' não sejam coprimos.
   */
  public static modInverse(
    a: number,
    m: number = ModularArithmetic.ALPHABET_SIZE
  ): number {
    const normalizedA = this.mod(a, m);
    const { gcd, x } = this.extendedGcd(normalizedA, m);

    if (gcd !== 1) {
      throw new Error(`Não existe inverso modular para ${a} módulo ${m} (mdc = ${gcd}).`);
    }

    return this.mod(x, m);
  }
}

/**
 * Álgebra linear e operações com matrizes sobre o anel modular Z_m.
 */
export class ModularMatrix {
  /**
   * Extrai a submatriz excluindo a linha 'excludedRow' e a coluna 'excludedCol'.
   */
  public static submatrix(
    matrix: readonly (readonly number[])[],
    excludedRow: number,
    excludedCol: number
  ): number[][] {
    const sub: number[][] = [];
    for (let r = 0; r < matrix.length; r++) {
      if (r === excludedRow) continue;
      const row: number[] = [];
      for (let c = 0; c < matrix[r].length; c++) {
        if (c === excludedCol) continue;
        row.push(matrix[r][c]);
      }
      sub.push(row);
    }
    return sub;
  }

  /**
   * Calcula o determinante de uma matriz quadrada via expansão de Laplace.
   */
  public static determinant(matrix: readonly (readonly number[])[]): number {
    const n = matrix.length;
    if (n === 1) {
      return matrix[0][0];
    }
    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let c = 0; c < n; c++) {
      const sub = this.submatrix(matrix, 0, c);
      const sign = c % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][c] * this.determinant(sub);
    }
    return det;
  }

  /**
   * Calcula a matriz adjunta (transposta da matriz de cofatores) módulo m.
   */
  public static adjugate(
    matrix: readonly (readonly number[])[],
    m: number = ModularArithmetic.ALPHABET_SIZE
  ): number[][] {
    const n = matrix.length;
    if (n === 1) {
      return [[1]];
    }
    if (n === 2) {
      // Para matriz 2x2: [[a, b], [c, d]] -> adjugate = [[d, -b], [-c, a]]
      return [
        [ModularArithmetic.mod(matrix[1][1], m), ModularArithmetic.mod(-matrix[0][1], m)],
        [ModularArithmetic.mod(-matrix[1][0], m), ModularArithmetic.mod(matrix[0][0], m)],
      ];
    }

    const adj: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const sub = this.submatrix(matrix, r, c);
        const cofactor = ( (r + c) % 2 === 0 ? 1 : -1 ) * this.determinant(sub);
        // Transposição: elemento (r, c) da matriz de cofatores vai para (c, r) na adjunta
        adj[c][r] = ModularArithmetic.mod(cofactor, m);
      }
    }

    return adj;
  }

  /**
   * Calcula a matriz inversa modular K^-1 = (det^-1 * adj(K)) (mod m).
   *
   * @throws {NonInvertibleKeyError} Se o determinante não for coprimo com m.
   */
  public static inverse(
    matrix: readonly (readonly number[])[],
    m: number = ModularArithmetic.ALPHABET_SIZE
  ): number[][] {
    const rawDet = this.determinant(matrix);
    const modDet = ModularArithmetic.mod(rawDet, m);
    const gcd = ModularArithmetic.gcd(modDet, m);

    if (gcd !== 1) {
      throw new NonInvertibleKeyError(rawDet, gcd);
    }

    const detInverse = ModularArithmetic.modInverse(modDet, m);
    const adj = this.adjugate(matrix, m);
    const n = matrix.length;

    const inv: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        inv[r][c] = ModularArithmetic.mod(adj[r][c] * detInverse, m);
      }
    }

    return inv;
  }

  /**
   * Multiplica uma matriz por um vetor coluna sob módulo m.
   */
  public static multiplyVector(
    matrix: readonly (readonly number[])[],
    vector: readonly number[],
    m: number = ModularArithmetic.ALPHABET_SIZE
  ): number[] {
    const n = matrix.length;
    if (vector.length !== n) {
      throw new Error(`Incompatibilidade de dimensões: matriz ${n}x${n} vs vetor de tamanho ${vector.length}.`);
    }

    const result: number[] = new Array(n);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) {
        sum += matrix[r][c] * vector[c];
      }
      result[r] = ModularArithmetic.mod(sum, m);
    }

    return result;
  }
}

/**
 * Orquestrador da Cifra de Hill com suporte a chaves em formato textual ou matricial.
 */
export class HillCipher {
  /**
   * Converte uma cadeia alfanumérica ou matriz em uma matriz numérica quadrada de ordem n.
   * Exemplo: "HILL" -> [[7, 8], [11, 11]] (H=7, I=8, L=11, L=11)
   */
  public static parseKey(key: string | readonly (readonly number[])[], expectedDim?: number): number[][] {
    if (typeof key !== "string") {
      const dim = key.length;
      if (dim < 2 || !key.every((row) => row.length === dim)) {
        throw new Error("A matriz fornecida deve ser quadrada com dimensão mínima 2x2.");
      }
      return key.map((row) => row.map((val) => ModularArithmetic.mod(val)));
    }

    const cleanLetters = key.toUpperCase().replace(/[^A-Z]/g, "");
    const totalLetters = cleanLetters.length;

    let dim = expectedDim;
    if (!dim) {
      const sqrt = Math.round(Math.sqrt(totalLetters));
      if (sqrt * sqrt === totalLetters && sqrt >= 2) {
        dim = sqrt;
      } else {
        throw new Error(
          `O comprimento da chave textual (${totalLetters} caracteres alfabéticos) não forma um quadrado perfeito. ` +
            `Use 4 letras para matriz 2x2, 9 letras para 3x3, etc.`
        );
      }
    }

    if (totalLetters < dim * dim) {
      throw new Error(`A chave necessita de ${dim * dim} letras para formar uma matriz ${dim}x${dim}.`);
    }

    const matrix: number[][] = [];
    let idx = 0;
    for (let r = 0; r < dim; r++) {
      const row: number[] = [];
      for (let c = 0; c < dim; c++) {
        row.push(cleanLetters.charCodeAt(idx) - "A".charCodeAt(0));
        idx++;
      }
      matrix.push(row);
    }

    return matrix;
  }

  /**
   * Encripta um texto claro através da Cifra de Hill.
   *
   * @param plaintext - Texto claro (letras A-Z).
   * @param key - Chave em formato de texto (ex: "HILL") ou matriz numérica.
   * @param paddingChar - Caractere de preenchimento caso o texto não seja múltiplo da dimensão (padrão 'X').
   */
  public static encrypt(
    plaintext: string,
    key: string | readonly (readonly number[])[],
    paddingChar: string = "X"
  ): HillEncryptionResult {
    const keyMatrix = this.parseKey(key);
    const dimension = keyMatrix.length;

    // Valida e calcula a inversa modular para assegurar que a decriptação será viável
    const rawDet = ModularMatrix.determinant(keyMatrix);
    const modDet = ModularArithmetic.mod(rawDet);
    const inverseKeyMatrix = ModularMatrix.inverse(keyMatrix);
    const modInverseDet = ModularArithmetic.modInverse(modDet);

    let cleanPlaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    if (!cleanPlaintext) {
      throw new Error("A mensagem para a Cifra de Hill deve conter ao menos uma letra alfabética.");
    }

    const remainder = cleanPlaintext.length % dimension;
    let paddingCount = 0;
    if (remainder !== 0) {
      paddingCount = dimension - remainder;
      cleanPlaintext += paddingChar.toUpperCase().repeat(paddingCount);
    }

    const blockTransformations: HillBlockTransformation[] = [];
    const ciphertextChars: string[] = [];

    for (let i = 0; i < cleanPlaintext.length; i += dimension) {
      const blockStr = cleanPlaintext.slice(i, i + dimension);
      const inputVector = blockStr.split("").map((c) => c.charCodeAt(0) - "A".charCodeAt(0));
      const outputVector = ModularMatrix.multiplyVector(keyMatrix, inputVector);
      const outputChars = outputVector.map((val) => String.fromCharCode(val + "A".charCodeAt(0))).join("");

      ciphertextChars.push(outputChars);
      blockTransformations.push({
        blockIndex: Math.floor(i / dimension),
        inputChars: blockStr,
        inputVector,
        outputVector,
        outputChars,
      });
    }

    return {
      plaintextFormatted: cleanPlaintext,
      ciphertext: ciphertextChars.join(""),
      dimension,
      keyMatrix,
      inverseKeyMatrix,
      determinant: modDet,
      modularInverseDeterminant: modInverseDet,
      paddingCount,
      blockTransformations,
    };
  }

  /**
   * Decripta um texto cifrado utilizando a matriz inversa modular.
   *
   * @param ciphertext - Texto cifrado composto de letras alfabéticas.
   * @param key - Chave original (em texto ou matriz).
   */
  public static decrypt(
    ciphertext: string,
    key: string | readonly (readonly number[])[]
  ): string {
    const keyMatrix = this.parseKey(key);
    const dimension = keyMatrix.length;
    const inverseMatrix = ModularMatrix.inverse(keyMatrix);

    const cleanCipher = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanCipher.length % dimension !== 0) {
      throw new Error(
        `O comprimento do texto cifrado (${cleanCipher.length}) deve ser um múltiplo exato da dimensão da matriz (${dimension}).`
      );
    }

    const plaintextChars: string[] = [];

    for (let i = 0; i < cleanCipher.length; i += dimension) {
      const blockStr = cleanCipher.slice(i, i + dimension);
      const vector = blockStr.split("").map((c) => c.charCodeAt(0) - "A".charCodeAt(0));
      const decryptedVector = ModularMatrix.multiplyVector(inverseMatrix, vector);
      const chars = decryptedVector.map((val) => String.fromCharCode(val + "A".charCodeAt(0))).join("");
      plaintextChars.push(chars);
    }

    return plaintextChars.join("");
  }
}
