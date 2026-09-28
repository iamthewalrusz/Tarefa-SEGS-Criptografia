import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarMensagem,
  gerarChaveRepetida,
  encriptar,
  decriptar,
} from '../src/algorithms/vigenere.ts';

describe('Cifra de Vigenère - Atividade 3', () => {
  it('deve validar mensagens com no mínimo quatro palavras', () => {
    assert.equal(validarMensagem('Apenas tres palavras'), false);
    assert.equal(validarMensagem('Esta frase contem quatro palavras'), true);
    assert.equal(validarMensagem('Mais uma frase com cinco palavras aqui'), true);
  });

  it('deve gerar chave repetida alinhando com caracteres alfabéticos', () => {
    const msg = 'Ola Mundo! Teste.';
    const chave = 'CHAVE';
    const alinhada = gerarChaveRepetida(msg, chave);
    assert.equal(alinhada, 'CHA VECHA! VECHA.');
  });

  it('deve encriptar e decriptar preservando integridade (Round-Trip)', () => {
    const fraseOriginal = 'A cifra de Vigenere e polialfabetica';
    const chave = 'CHAVE';

    const textoCifrado = encriptar(fraseOriginal, chave);
    assert.notEqual(textoCifrado, fraseOriginal);

    const textoDecriptado = decriptar(textoCifrado, chave);
    assert.equal(textoDecriptado, fraseOriginal);
  });

  it('deve lançar erro se a mensagem tiver menos de 4 palavras', () => {
    assert.throws(() => encriptar('Mensagem curta aqui', 'CHAVE'), /no mínimo quatro palavras/);
  });

  it('deve lançar erro se a chave não contiver letras', () => {
    assert.throws(() => gerarChaveRepetida('Quatro palavras para teste', '1234!'), /ao menos uma letra/);
  });
});
