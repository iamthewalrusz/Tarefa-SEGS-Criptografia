/**
 * Cifra de Vigenère
 *
 * Tradução fiel e direta para TypeScript do algoritmo implementado por João Vitor
 * no arquivo original `algoritmos/vigenere.py`.
 */

export function validarMensagem(mensagem: string): boolean {
  /** Valida se a mensagem contém no mínimo quatro palavras. */
  const palavras = mensagem.trim().split(/\s+/).filter(Boolean);
  return palavras.length >= 4;
}

export function gerarChaveRepetida(mensagem: string, chave: string): string {
  /** Repete a chave até cobrir o tamanho da mensagem, alinhando apenas com caracteres alfabéticos. */
  const chaveLimpa = chave.split("").filter((c) => /^[a-zA-Z]$/.test(c)).join("");
  if (!chaveLimpa) {
    throw new Error("A chave deve conter ao menos uma letra.");
  }

  const chaveAlinhada: string[] = [];
  let idxChave = 0;

  for (const char of mensagem) {
    if (/^[a-zA-Z]$/.test(char)) {
      chaveAlinhada.push(chaveLimpa[idxChave % chaveLimpa.length]);
      idxChave += 1;
    } else {
      chaveAlinhada.push(char);
    }
  }

  return chaveAlinhada.join("");
}

export function encriptar(mensagem: string, chave: string): string {
  /** Encripta uma mensagem utilizando a Cifra de Vigenère. */
  if (!validarMensagem(mensagem)) {
    throw new Error("A mensagem deve conter no mínimo quatro palavras.");
  }

  const chaveAlinhada = gerarChaveRepetida(mensagem, chave);
  const resultado: string[] = [];

  for (let i = 0; i < mensagem.length; i++) {
    const mChar = mensagem[i];
    const kChar = chaveAlinhada[i];

    if (/^[a-zA-Z]$/.test(mChar)) {
      const isUpper = mChar === mChar.toUpperCase();
      const base = isUpper ? "A".charCodeAt(0) : "a".charCodeAt(0);
      const shift = kChar.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
      const novoChar = String.fromCharCode(((mChar.charCodeAt(0) - base + shift) % 26) + base);
      resultado.push(novoChar);
    } else {
      resultado.push(mChar);
    }
  }

  return resultado.join("");
}

export function decriptar(mensagemCifrada: string, chave: string): string {
  /** Decripta uma mensagem cifrada utilizando a Cifra de Vigenère. */
  const chaveAlinhada = gerarChaveRepetida(mensagemCifrada, chave);
  const resultado: string[] = [];

  for (let i = 0; i < mensagemCifrada.length; i++) {
    const cChar = mensagemCifrada[i];
    const kChar = chaveAlinhada[i];

    if (/^[a-zA-Z]$/.test(cChar)) {
      const isUpper = cChar === cChar.toUpperCase();
      const base = isUpper ? "A".charCodeAt(0) : "a".charCodeAt(0);
      const shift = kChar.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
      const offset = (cChar.charCodeAt(0) - base - shift) % 26;
      const normalizado = offset < 0 ? offset + 26 : offset;
      const novoChar = String.fromCharCode(normalizado + base);
      resultado.push(novoChar);
    } else {
      resultado.push(cChar);
    }
  }

  return resultado.join("");
}
