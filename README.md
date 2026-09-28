# 🔐 Laboratório de Criptografia Clássica e Moderna

Repositório da disciplina de **Segurança de Sistemas (JCRSEGS)** — Instituto Federal de São Paulo (IFSP).  
Professor: **Tardelli Stekel**

O projeto consiste no desenvolvimento de uma aplicação web analítica e interativa em **TypeScript** que implementa, simula e demonstra formalmente os algoritmos criptográficos propostos, sem a utilização de bibliotecas prontas.

---

## 📋 Divisão dos exercícios

| Nº | Exercício | Responsável | Status | Implementação |
| :---: | --- | --- | :---: | :---: |
| 1 | **One-Time Pad (OTP)** | Veríssimo | ✅ Concluído | TypeScript (Clean Code) + Simulador Web |
| 2 | **Cifra de César** | Fabio | ⏳ Pendente | — |
| 3 | **Cifra de Vigenère** | João Vitor | ✅ Concluído | Tradução Fiel em TypeScript + Simulador Web |
| 4 | **Cifra de Hill** | Veríssimo | ✅ Concluído | TypeScript (Clean Code) + Simulador Web ($2\times 2$ e $3\times 3$) |
| 5 | **Módulo Livre** | Fabio | ⏳ Pendente | — |

> **Progresso:** 3 de 5 exercícios concluídos — **60%**.

---

## 🚀 Funcionalidades da Aplicação Web

A aplicação conta com uma interface moderna desenvolvida com **Vite, TypeScript, Tailwind CSS e KaTeX**, oferecendo:

1. **One-Time Pad (OTP - Exercício 1)**:
   - Entrada e saída em valores do sistema decimal (base 10).
   - Conversão explícita Decimal $\to$ Binário $\to$ XOR bit a bit $\to$ Decimal.
   - Algoritmo de decriptação simétrica e gerador de chaves seguras.
   - Tabela comparativa de alinhamento de bits em tempo real.
2. **Cifra de Vigenère (Exercício 3)**:
   - Validação em tempo real do requisito de no mínimo 4 palavras.
   - Alinhamento visual da chave repetida caractere a caractere.
   - Encriptação e decriptação preservando maiúsculas, minúsculas e pontuação.
3. **Cifra de Hill (Exercício 4)**:
   - Álgebra linear modular completa sobre $\mathbb{Z}_{26}$.
   - Suporte a ordens $2 \times 2$ e $3 \times 3$, com chaves em texto ou matriz numérica.
   - Diagnóstico matemático em tempo real: cálculo de $\det(K)$, verificação de coprimalidade $\gcd(\det, 26) = 1$, inverso modular $\det^{-1} \pmod{26}$, matriz adjunta e matriz inversa $K^{-1} \pmod{26}$.
   - Tratamento de matrizes singulares não-inversíveis e aplicação de padding `'X'`.
4. **Fundamentação Acadêmica e Epistemológica**:
   - Cada técnica conta com capítulo teórico estruturado (Shannon 1949, Lester Hill 1929, Bellaso 1553), decodificação de termos em notação KaTeX e conteinerização preparada para demonstrações visuais animadas.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 20+ ou 22+.

### Instalação
```bash
npm install
```

### Executar a Aplicação Web em Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

### Executar a Suíte de Testes Automatizados
```bash
npm test
```
Executa a suíte de testes unitários nativa do Node.js validando 100% dos algoritmos de OTP, Vigenère e Hill.

### Build para Produção (Otimizado para GitHub Pages)
```bash
npm run build
npm run preview
```
O build estático compilado é gerado na pasta `dist/` com caminhos relativos prontos para hospedagem direta no GitHub Pages.
