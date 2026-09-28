import './style.css';
import katex from 'katex';
import { OtpCipher } from './algorithms/otp';
import { encriptar as vigenereEncrypt, decriptar as vigenereDecrypt, validarMensagem, gerarChaveRepetida } from './algorithms/vigenere';
import { HillCipher, ModularMatrix, ModularArithmetic } from './algorithms/hill';

// Helper para renderização segura de KaTeX
function tex(math: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(math, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return `<code class="font-mono text-xs">${math}</code>`;
  }
}

// Elementos de estado
let activeTab = 'visao-geral';

// Template da aba Visão Geral
function renderVisaoGeral(): string {
  return `
    <div class="space-y-8 animate-fadeIn">
      <!-- Apresentação Geral -->
      <section class="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 backdrop-blur">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium mb-4">
            <span>🛡️ Segurança de Sistemas (JCRSEGS)</span>
            <span>&bull;</span>
            <span>Prof. Tardelli Stekel</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Laboratório Interativo de Criptografia Clássica e Moderna
          </h2>
          <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Plataforma computacional e epistemológica desenvolvida para análise, simulação e demonstração formal
            dos algoritmos de cifragem fundamentais solicitados na atividade acadêmica. Implementado em
            <strong>TypeScript</strong> nativo, sem bibliotecas criptográficas prontas, contemplando tanto a
            rigorosidade matemática quanto a experimentação prática em tempo real.
          </p>
        </div>

        <!-- Matriz de Divisão de Atividades -->
        <div class="mt-8 border-t border-slate-800 pt-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 class="text-base font-semibold text-white flex items-center gap-2">
              <span>📋 Divisão dos Exercícios e Status da Equipe</span>
            </h3>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              Progresso do Repositório: <strong>60% concluído (3 de 5)</strong>
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 font-medium">
                  <th class="py-2.5 px-3">Nº</th>
                  <th class="py-2.5 px-3">Exercício / Técnica</th>
                  <th class="py-2.5 px-3">Responsável</th>
                  <th class="py-2.5 px-3">Status</th>
                  <th class="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 font-mono">
                <tr class="bg-teal-950/20 text-slate-200">
                  <td class="py-3 px-3 font-semibold text-teal-400">1</td>
                  <td class="py-3 px-3 font-sans font-medium text-white">One-Time Pad (OTP) Decimal e Binário</td>
                  <td class="py-3 px-3 text-slate-300">Veríssimo</td>
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
                      ✅ Concluído (TypeScript)
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button class="nav-jump text-xs text-teal-400 hover:text-teal-300 underline font-sans" data-jump="otp">Acessar &rarr;</button>
                  </td>
                </tr>
                <tr class="text-slate-400">
                  <td class="py-3 px-3">2</td>
                  <td class="py-3 px-3 font-sans">Cifra de César</td>
                  <td class="py-3 px-3">Fabio</td>
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-amber-950/40 border border-amber-800/40 text-amber-400">
                      ⏳ Pendente
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right text-slate-400">—</td>
                </tr>
                <tr class="bg-slate-900/40 text-slate-200">
                  <td class="py-3 px-3 font-semibold text-teal-400">3</td>
                  <td class="py-3 px-3 font-sans font-medium text-white">Cifra de Vigenère</td>
                  <td class="py-3 px-3 text-slate-300">João Vitor</td>
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
                      ✅ Concluído (Traduzido TS)
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button class="nav-jump text-xs text-teal-400 hover:text-teal-300 underline font-sans" data-jump="vigenere">Acessar &rarr;</button>
                  </td>
                </tr>
                <tr class="bg-teal-950/20 text-slate-200">
                  <td class="py-3 px-3 font-semibold text-teal-400">4</td>
                  <td class="py-3 px-3 font-sans font-medium text-white">Cifra de Hill (Álgebra Linear Modular)</td>
                  <td class="py-3 px-3 text-slate-300">Veríssimo</td>
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
                      ✅ Concluído (TypeScript)
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button class="nav-jump text-xs text-teal-400 hover:text-teal-300 underline font-sans" data-jump="hill">Acessar &rarr;</button>
                  </td>
                </tr>
                <tr class="text-slate-400">
                  <td class="py-3 px-3">5</td>
                  <td class="py-3 px-3 font-sans">Módulo Livre (Expansão / Criptoanálise)</td>
                  <td class="py-3 px-3">Fabio</td>
                  <td class="py-3 px-3">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-amber-950/40 border border-amber-800/40 text-amber-400">
                      ⏳ Pendente
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right text-slate-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Cartões das Cifras Concluídas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition group">
          <div class="text-teal-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">Exercício 1</div>
          <h4 class="text-lg font-bold text-white group-hover:text-teal-300 transition">One-Time Pad (OTP)</h4>
          <p class="text-xs text-slate-400 mt-2 line-clamp-3">
            Cifragem de Vernam com entradas e saídas decimais na base 10, conversão explícita para cadeia binária e operação XOR simétrica.
          </p>
          <button class="mt-4 nav-jump inline-flex items-center text-xs font-medium text-teal-400 hover:text-teal-300" data-jump="otp">
            Abrir simulador e teoria &rarr;
          </button>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition group">
          <div class="text-teal-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">Exercício 3</div>
          <h4 class="text-lg font-bold text-white group-hover:text-teal-300 transition">Cifra de Vigenère</h4>
          <p class="text-xs text-slate-400 mt-2 line-clamp-3">
            Cifra polialfabética de substituição periódica com validação de mensagens de no mínimo 4 palavras e alinhamento cíclico da chave.
          </p>
          <button class="mt-4 nav-jump inline-flex items-center text-xs font-medium text-teal-400 hover:text-teal-300" data-jump="vigenere">
            Abrir simulador e teoria &rarr;
          </button>
        </div>

        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-teal-500/40 transition group">
          <div class="text-teal-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">Exercício 4</div>
          <h4 class="text-lg font-bold text-white group-hover:text-teal-300 transition">Cifra de Hill</h4>
          <p class="text-xs text-slate-400 mt-2 line-clamp-3">
            Álgebra linear modular sobre Z_26, com cálculo de determinante, matriz adjunta, inversa modular por Euclides Estendido e suporte a 2x2 e 3x3.
          </p>
          <button class="mt-4 nav-jump inline-flex items-center text-xs font-medium text-teal-400 hover:text-teal-300" data-jump="hill">
            Abrir simulador e teoria &rarr;
          </button>
        </div>
      </div>
    </div>
  `;
}

// Template da aba One-Time Pad
function renderOtpTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-5xl mx-auto">
      <!-- Breadcrumb e Cabeçalho -->
      <div>
        <div class="text-xs font-mono text-teal-400 uppercase tracking-wider">Exercício 1 &bull; Atividade de Segurança de Sistemas</div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          One-Time Pad (OTP) e a Operação XOR Decimal
        </h2>
        <p class="text-sm text-slate-400 mt-2">
          Fundamentação teórica de Shannon, conversão de bases numéricas e simulador de cifragem/decifragem.
        </p>
      </div>

      <!-- Seção 1: Contextualização Epistemológica e Histórica -->
      <section class="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          1. Origem Epistemológica e Contexto Histórico
        </h3>
        <p>
          O algoritmo <em>One-Time Pad</em> (OTP), inicialmente concebido por <strong>Gilbert Vernam em 1919</strong>
          para a telegrafia automática e posteriormente aperfeiçoado pelo major <strong>Joseph Mauborgne</strong>,
          constitui um marco divisor na história da criptologia. Em 1949, o matemático <strong>Claude Shannon</strong>
          publicou sua obra seminal, <em>"Communication Theory of Secrecy Systems"</em> no <em>Bell System Technical Journal</em>,
          estabelecendo a prova formal de que o OTP provê <strong>sigilo perfeito</strong> (<em>perfect secrecy</em>).
        </p>
        <p>
          No paradigma de Shannon, uma cifra possui sigilo perfeito quando o conhecimento do criptograma
          ${tex("C")} não fornece nenhuma informação adicional a respeito do conteúdo da mensagem original ${tex("M")}.
          Formalmente, isso se traduz pela igualdade de probabilidades a posteriori e a priori:
        </p>
        <div class="math-block bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          ${tex("\\mathbb{P}(M = m \\mid C = c) = \\mathbb{P}(M = m), \\quad \\forall m \\in \\mathcal{M}, \\; c \\in \\mathcal{C}", true)}
        </div>
      </section>

      <!-- Seção 2: Fundamentação Matemática e Decodificação de Notação -->
      <section class="space-y-4 text-sm text-slate-300 leading-relaxed">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          2. Fundamentação Teórica e Formulação Matemática
        </h3>
        <p>
          A operação fundamental do One-Time Pad clássico é a adição bit a bit em corpo finito ${tex("\\mathbb{F}_2")},
          isomórfica à porta lógica <strong>OU Exclusivo (XOR)</strong>, denotada por ${tex("\\oplus")}.
          No presente exercício acadêmico, o algoritmo recebe valores no sistema decimal (base 10), realiza a conversão
          explícita para sequências binárias, executa a operação ${tex("\\oplus")} e reconverte o resultado para a base 10.
        </p>

        <!-- Decodificação de Notação e Termos em Blockquote Identificado -->
        <div class="border-l-4 border-teal-500 bg-slate-900/80 p-4 rounded-r-lg space-y-2">
          <div class="text-xs font-semibold text-teal-400 uppercase tracking-wider font-mono">
            Decodificação de Notação e Termos:
          </div>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300">
            <li><strong>${tex("M_{10}")}</strong>: Mensagem em texto claro expressa como inteiro no sistema decimal (base 10).</li>
            <li><strong>${tex("K_{10}")}</strong>: Chave criptográfica única e aleatória no sistema decimal (base 10).</li>
            <li><strong>${tex("\\operatorname{bin}(x)")}</strong>: Função de conversão determinística de base 10 para base 2 por divisões sucessivas.</li>
            <li><strong>${tex("C_{10}")}</strong>: Criptograma resultante apresentado no sistema decimal (base 10).</li>
            <li><strong>${tex("\\oplus")}</strong>: Operador booleano XOR aplicado a cada par de bits alinhados (${tex("a \\oplus b = (a + b) \\pmod 2")}).</li>
          </ul>
        </div>

        <p>
          A propriedade algébrica que viabiliza a decriptação exata é a <strong>auto-inversibilidade</strong> do operador XOR,
          decorrente do fato de que todo elemento em ${tex("(\\mathbb{F}_2^n, \\oplus)")} é seu próprio inverso aditivo:
        </p>
        <div class="math-block bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          ${tex("C = M \\oplus K \\implies C \\oplus K = (M \\oplus K) \\oplus K = M \\oplus (K \\oplus K) = M \\oplus \\mathbf{0} = M", true)}
        </div>
      </section>

      <!-- Seção 3: Demonstração Visual em Vídeo (Placeholder Estruturado) -->
      <section class="space-y-3">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          3. Demonstração Visual em Vídeo (Manim &bull; Didactic Animation)
        </h3>
        <p class="text-xs text-slate-400">
          A animação a seguir sintetiza visualmente o fluxo de decomposição de valores decimais em trens de bits, o scanner de comparação lógica XOR e a reconstituição decimal simétrica:
        </p>
        
        <!-- Componente Didático de Vídeo Conforme Padrão DataLab -->
        <figure class="flex flex-col items-center justify-center my-6">
          <div class="w-full max-w-xl aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center shadow-lg relative group">
            <div class="h-12 w-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl mb-3">
              ▶
            </div>
            <h4 class="text-sm font-semibold text-white">Vídeo Didático: Operação de Fluxo OTP</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-sm">
              Demonstração vetorial em alta eficiência com Manim Community e FFmpeg.
              Fluxo: <code>M = 42 (00101010)</code> &oplus; <code>K = 27 (00011011)</code> = <code>C = 49 (00110001)</code>.
            </p>
            <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-teal-400 font-mono">
              <span>Roteiro Aprovado &bull; Pronto para Renderização</span>
            </div>
          </div>
          <figcaption class="mt-2 text-center text-xs text-slate-400 font-medium max-w-md">
            Figura 1: Transformação bit a bit no One-Time Pad, ilustrando o cancelamento mútuo da chave na decifragem.
          </figcaption>
        </figure>
      </section>

      <!-- Seção 4: Laboratório Interativo (Simulador OTP) -->
      <section class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🧪 Bancada Experimental: Simulador OTP</span>
            <span class="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono">Decimal &harr; Binário</span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Insira os valores numéricos decimais de entrada para observar a conversão binária e a operação XOR passo a passo.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Entrada: Mensagem Decimal -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mensagem (Texto Claro em Base 10)
            </label>
            <input
              type="number"
              id="otp-msg-input"
              value="42"
              min="0"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition"
              placeholder="Ex: 42"
            />
          </div>

          <!-- Entrada: Chave Decimal -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Chave (Em Base 10)
              </label>
              <button
                type="button"
                id="otp-btn-gen-key"
                class="text-xs text-teal-400 hover:text-teal-300 font-mono underline"
              >
                Gerar Chave Segura
              </button>
            </div>
            <input
              type="number"
              id="otp-key-input"
              value="27"
              min="0"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition"
              placeholder="Ex: 27"
            />
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="otp-btn-encrypt"
            class="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition shadow-sm"
          >
            🔒 Encriptar (Base 10 &rarr; Binário &rarr; Base 10)
          </button>
          <button
            type="button"
            id="otp-btn-decrypt"
            class="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            🔓 Decriptar (Inversão XOR)
          </button>
        </div>

        <!-- Painel de Resultados do OTP -->
        <div id="otp-results-panel" class="border-t border-slate-800 pt-5 space-y-4">
          <!-- Renderizado dinamicamente por updateOtpView() -->
        </div>
      </section>

      <!-- Referências Bibliográficas Canônicas -->
      <section class="border-t border-slate-800 pt-6 text-xs text-slate-400 space-y-2">
        <h4 class="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Referências Bibliográficas</h4>
        <p>1. SHANNON, Claude E. <em>Communication Theory of Secrecy Systems</em>. Bell System Technical Journal, v. 28, n. 4, p. 656–715, 1949.</p>
        <p>2. VERNAM, Gilbert S. <em>Cipher Printing Telegraph Systems For Secret Wire and Radio Telegraphic Communications</em>. Transactions of the American Institute of Electrical Engineers, v. 45, p. 295–301, 1926.</p>
      </section>
    </div>
  `;
}

// Template da aba Vigenère
function renderVigenereTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <div class="text-xs font-mono text-teal-400 uppercase tracking-wider">Exercício 3 &bull; Atividade de Segurança de Sistemas</div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Cifra de Vigenère (Substituição Polialfabética)
        </h2>
        <p class="text-sm text-slate-400 mt-2">
          Implementação em TypeScript a partir do código original de João Vitor, com validação de 4 palavras e alinhamento de chave.
        </p>
      </div>

      <!-- Seção 1: Contexto Histórico -->
      <section class="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          1. Origem Epistemológica e Contexto Histórico
        </h3>
        <p>
          Descrita originalmente pelo criptologista italiano <strong>Giovan Battista Bellaso em 1553</strong>
          (<em>La cifra del. Sig. Giovan Battista Bellaso</em>) e popularizada no século XIX atribuída a <strong>Blaise de Vigenère</strong>,
          esta técnica foi considerada por mais de três séculos como <em>"le chiffre indéchiffrable"</em> (a cifra indecifrável).
        </p>
        <p>
          Diferentemente da Cifra de César — que aplica um deslocamento estático único a todo o texto —, Vigenère
          emprega múltiplos alfabetos de César de forma cíclica e periódica guiados por uma palavra-chave.
          Isso confunde a análise de frequência direta de letras individuais, até sua posterior quebra metódica por
          <strong>Friedrich Kasiski em 1863</strong> através do exame de repetições de n-gramas.
        </p>
      </section>

      <!-- Seção 2: Formulação Matemática -->
      <section class="space-y-4 text-sm text-slate-300 leading-relaxed">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          2. Formulação Matemática
        </h3>
        <p>
          Seja o alfabeto mapeado nos inteiros ${tex("\\mathbb{Z}_{26} = \\{0, 1, \\dots, 25\\}")} com ${tex("A \\mapsto 0")}, ${tex("B \\mapsto 1")}, ${tex("\\dots")}, ${tex("Z \\mapsto 25")}.
          Dada uma mensagem de comprimento ${tex("n")} e uma chave de comprimento ${tex("L")}, as operações são dadas por:
        </p>

        <div class="math-block bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
          <div>${tex("c_i = (m_i + k_{i \\pmod L}) \\pmod{26} \\quad \\text{(Encriptação)}", true)}</div>
          <div>${tex("m_i = (c_i - k_{i \\pmod L} + 26) \\pmod{26} \\quad \\text{(Decriptação)}", true)}</div>
        </div>

        <div class="border-l-4 border-teal-500 bg-slate-900/80 p-4 rounded-r-lg space-y-2">
          <div class="text-xs font-semibold text-teal-400 uppercase tracking-wider font-mono">
            Critérios do Exercício Acadêmico:
          </div>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300">
            <li>A mensagem deve ser uma frase contendo <strong>no mínimo quatro palavras</strong>.</li>
            <li>A chave é repetida ciclicamente cobrindo o tamanho da mensagem, alinhando-se estritamente aos caracteres alfabéticos.</li>
            <li>Caracteres de pontuação e espaços em branco são preservados integralmente.</li>
          </ul>
        </div>
      </section>

      <!-- Seção 3: Simulador Interativo Vigenère -->
      <section class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🧪 Bancada Experimental: Cifra de Vigenère</span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Teste a encriptação e decriptação com a regra de no mínimo quatro palavras.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mensagem (Mínimo de 4 palavras)
            </label>
            <textarea
              id="vig-msg-input"
              rows="2"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition"
              placeholder="Digite ao menos quatro palavras..."
            >A cifra de Vigenere e polialfabetica</textarea>
            <div id="vig-word-counter" class="text-xs text-slate-400 mt-1 font-mono"></div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Chave de Acesso
            </label>
            <input
              type="text"
              id="vig-key-input"
              value="CHAVE"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition"
              placeholder="Ex: CHAVE"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="vig-btn-encrypt"
            class="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition"
          >
            🔒 Encriptar
          </button>
          <button
            type="button"
            id="vig-btn-decrypt"
            class="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            🔓 Decriptar
          </button>
        </div>

        <div id="vig-results-panel" class="border-t border-slate-800 pt-5 space-y-4">
          <!-- Dinâmico -->
        </div>
      </section>

      <!-- Referências -->
      <section class="border-t border-slate-800 pt-6 text-xs text-slate-400 space-y-2">
        <h4 class="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Referências Bibliográficas</h4>
        <p>1. BELLASO, Giovan Battista. <em>La cifra del. Sig. Giovan Battista Bellaso</em>. Roma, 1553.</p>
        <p>2. KASISKI, Friedrich W. <em>Die Geheimschriften und die Dechiffrir-Kunst</em>. Berlim: E. S. Mittler und Sohn, 1863.</p>
      </section>
    </div>
  `;
}

// Template da aba Cifra de Hill
function renderHillTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <div class="text-xs font-mono text-teal-400 uppercase tracking-wider">Exercício 4 &bull; Atividade de Segurança de Sistemas</div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Cifra de Hill e a Álgebra Linear Modular em ${tex("\\mathbb{Z}_{26}")}
        </h2>
        <p class="text-sm text-slate-400 mt-2">
          Substituição poligráfica fundamentada em multiplicação matricial, determinantes e inversão modular via Euclides Estendido.
        </p>
      </div>

      <!-- Seção 1: Contexto Histórico -->
      <section class="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          1. Origem Epistemológica e Contexto Histórico
        </h3>
        <p>
          Criada pelo matemático norte-americano <strong>Lester S. Hill em 1929</strong> e divulgada no periódico
          <em>The American Mathematical Monthly</em> com o artigo intitulado <em>"Cryptography in an Algebraic Alphabet"</em>,
          a Cifra de Hill representou a <strong>primeira aplicação sistemática da Álgebra Linear</strong> à criptografia.
        </p>
        <p>
          Enquanto as cifras anteriores operavam sobre caracteres isolados ou deslocamentos periódicos, Hill concebeu uma cifra
          <strong>poligráfica</strong> (operando sobre blocos simultâneos de ${tex("n")} caracteres), tornando a análise de frequência
          unigramática completamente ineficaz. O algoritmo mapeia um bloco de texto como um vetor de coordenadas e o submete a uma
          transformação linear no espaço afim discreto ${tex("\\mathbb{Z}_{26}^n")}.
        </p>
      </section>

      <!-- Seção 2: Formulação Matemática Rigorosa -->
      <section class="space-y-4 text-sm text-slate-300 leading-relaxed">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          2. Formulação Matemática e Condição de Invertibilidade
        </h3>
        <p>
          Seja ${tex("K \\in M_{n \\times n}(\\mathbb{Z}_{26})")} uma matriz quadrada de ordem ${tex("n")}, e seja ${tex("\\mathbf{p} = [p_1, p_2, \\dots, p_n]^T")}
          um vetor coluna representando um bloco de ${tex("n")} letras claras. O vetor cifrado ${tex("\\mathbf{c}")} e sua decriptação são:
        </p>

        <div class="math-block bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
          <div>${tex("\\mathbf{c} \\equiv K \\cdot \\mathbf{p} \\pmod{26}", true)}</div>
          <div>${tex("\\mathbf{p} \\equiv K^{-1} \\cdot \\mathbf{c} \\pmod{26}", true)}</div>
        </div>

        <!-- Teorema da Invertibilidade -->
        <div class="border-l-4 border-teal-500 bg-slate-900/80 p-4 rounded-r-lg space-y-2">
          <div class="text-xs font-semibold text-teal-400 uppercase tracking-wider font-mono">
            Condição Teórica para a Existência da Matriz Inversa ${tex("K^{-1}")}:
          </div>
          <p class="text-xs sm:text-sm text-slate-300">
            Uma matriz ${tex("K")} é inversível no anel ${tex("\\mathbb{Z}_{26}")} se, e somente se, o seu determinante for coprimo com 26:
          </p>
          <div class="math-block py-1">
            ${tex("\\gcd(\\det(K) \\pmod{26}, 26) = 1", true)}
          </div>
          <p class="text-xs text-slate-400">
            Dado que ${tex("26 = 2 \\times 13")}, a matriz só possui inversa se ${tex("\\det(K)")} <strong>não for múltiplo de 2</strong> (não pode ser par) e <strong>não for múltiplo de 13</strong>.
          </p>
        </div>

        <p>
          A matriz inversa modular é calculada através da fórmula da matriz adjunta (transposta dos cofatores):
        </p>
        <div class="math-block bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          ${tex("K^{-1} \\equiv (\\det K)^{-1} \\cdot \\operatorname{adj}(K) \\pmod{26}", true)}
        </div>
        <p>
          Onde ${tex("(\\det K)^{-1}")} denota o inverso multiplicativo modular calculado via o <strong>Algoritmo de Euclides Estendido</strong>
          encontrando a solução de Bézout ${tex("(\\det K) \\cdot x + 26 \\cdot y = 1")}.
        </p>
      </section>

      <!-- Seção 3: Demonstração Visual em Vídeo -->
      <section class="space-y-3">
        <h3 class="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          3. Demonstração Visual em Vídeo (Manim &bull; Didactic Animation)
        </h3>
        <p class="text-xs text-slate-400">
          A demonstração visual a seguir expõe a distorção vetorial e o mapeamento linear no plano cartesiano modular de Hill:
        </p>

        <figure class="flex flex-col items-center justify-center my-6">
          <div class="w-full max-w-xl aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center shadow-lg relative group">
            <div class="h-12 w-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl mb-3">
              ▶
            </div>
            <h4 class="text-sm font-semibold text-white">Vídeo Didático: Transformação Linear em Hill 2D</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-sm">
              Demonstração vetorial em alta eficiência com Manim Community e FFmpeg.
              Mapeamento do digrama <code>"HE" -> (7, 4)</code>, multiplicação modular por <code>K</code> resultando em <code>"HI" -> (7, 8)</code> e reversão por <code>K^-1</code>.
            </p>
            <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-teal-400 font-mono">
              <span>Roteiro Aprovado &bull; Pronto para Renderização</span>
            </div>
          </div>
          <figcaption class="mt-2 text-center text-xs text-slate-400 font-medium max-w-md">
            Figura 2: Mapeamento linear de pares de letras no anel modular Z_26 e sua recuperação geométrica via matriz inversa.
          </figcaption>
        </figure>
      </section>

      <!-- Seção 4: Laboratório Interativo (Simulador Hill) -->
      <section class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-lg font-bold text-white flex items-center justify-between">
            <span>🧪 Bancada Experimental: Cifra de Hill</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400 font-mono">Dimensão:</span>
              <button type="button" id="hill-dim-2" class="px-2.5 py-1 text-xs rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono font-bold">
                2 &times; 2
              </button>
              <button type="button" id="hill-dim-3" class="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700 font-mono">
                3 &times; 3
              </button>
            </div>
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Defina a chave via palavra ou elementos matriciais numéricos. O sistema diagnostica a invertibilidade em tempo real.
          </p>
        </div>

        <!-- Definição da Chave -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Chave em Palavra
              </label>
              <span class="text-[11px] text-slate-400 font-mono" id="hill-key-len-hint">4 letras para 2x2</span>
            </div>
            <input
              type="text"
              id="hill-word-key"
              value="DDCF"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition uppercase"
              placeholder="Ex: DDCF"
            />
            <p class="text-[11px] text-slate-400">
              Ou edite os valores numéricos diretamente na grade ao lado:
            </p>
          </div>

          <!-- Grade da Matriz K -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Matriz de Chave ${tex("K")} (mod 26)
            </label>
            <div id="hill-matrix-grid" class="grid gap-2 font-mono">
              <!-- Renderizado dinamicamente -->
            </div>
          </div>
        </div>

        <!-- Diagnóstico da Matriz em Tempo Real -->
        <div id="hill-diagnostic-panel" class="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs font-mono">
          <!-- Renderizado dinamicamente -->
        </div>

        <!-- Entrada da Mensagem -->
        <div class="space-y-3">
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Mensagem para Cifragem / Decifragem
          </label>
          <input
            type="text"
            id="hill-msg-input"
            value="CRIPTO"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500 transition uppercase"
            placeholder="Ex: CRIPTO"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="hill-btn-encrypt"
            class="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition"
          >
            🔒 Encriptar em Blocos
          </button>
          <button
            type="button"
            id="hill-btn-decrypt"
            class="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            🔓 Decriptar com Matriz Inversa
          </button>
        </div>

        <div id="hill-results-panel" class="border-t border-slate-800 pt-5 space-y-4">
          <!-- Dinâmico -->
        </div>
      </section>

      <!-- Referências -->
      <section class="border-t border-slate-800 pt-6 text-xs text-slate-400 space-y-2">
        <h4 class="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Referências Bibliográficas</h4>
        <p>1. HILL, Lester S. <em>Cryptography in an Algebraic Alphabet</em>. The American Mathematical Monthly, v. 36, n. 6, p. 306–312, 1929.</p>
        <p>2. DUMMIT, David S.; FOOTE, Richard M. <em>Abstract Algebra</em>. 3. ed. Hoboken: John Wiley & Sons, 2004.</p>
      </section>
    </div>
  `;
}

// Inicializador de Abas
function setupTabs(): void {
  const navTabs = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  navTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        activeTab = tab;
        renderActiveTab();
      }
    });
  });

  // Links internos de pulo
  document.querySelectorAll<HTMLButtonElement>('.nav-jump').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-jump');
      if (target) {
        activeTab = target;
        renderActiveTab();
      }
    });
  });
}

function updateTabButtons(): void {
  const navTabs = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  navTabs.forEach((btn) => {
    const tab = btn.getAttribute('data-tab');
    if (tab === activeTab) {
      btn.className = 'tab-btn px-3 py-1.5 rounded-md transition bg-teal-500/10 text-teal-300 border border-teal-500/30 font-medium';
    } else {
      btn.className = 'tab-btn px-3 py-1.5 rounded-md text-slate-400 hover:text-white transition font-medium';
    }
  });
}

// ==========================================
// CONTROLADORES DOS SIMULADORES
// ==========================================

// Controlador do OTP
function setupOtpSimulator(): void {
  const msgInput = document.getElementById('otp-msg-input') as HTMLInputElement | null;
  const keyInput = document.getElementById('otp-key-input') as HTMLInputElement | null;
  const btnGenKey = document.getElementById('otp-btn-gen-key');
  const btnEncrypt = document.getElementById('otp-btn-encrypt');
  const btnDecrypt = document.getElementById('otp-btn-decrypt');
  const resultsPanel = document.getElementById('otp-results-panel');

  if (!msgInput || !keyInput || !resultsPanel) return;

  function runEncryption(): void {
    try {
      const m = BigInt(msgInput!.value || '0');
      const k = BigInt(keyInput!.value || '0');
      const enc = OtpCipher.encrypt(m, k);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-teal-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
              Resultado da Cifragem OTP
            </span>
            <span class="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono">
              Alinhamento: ${enc.bitLength} bits
            </span>
          </div>

          <!-- Tabela de Alinhamento de Bits -->
          <div class="overflow-x-auto">
            <table class="w-full text-center font-mono text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800">
                  <th class="text-left py-1.5 px-3">Variável</th>
                  <th class="py-1.5 px-3">Base 10</th>
                  <th class="py-1.5 px-3 text-right">Representação Binária (Bits)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr>
                  <td class="text-left py-2 px-3 text-slate-300 font-sans">Mensagem Clara ${tex("M")}</td>
                  <td class="py-2 px-3 font-bold text-white">${enc.plaintextDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-teal-300">${enc.plaintextBinary}</td>
                </tr>
                <tr>
                  <td class="text-left py-2 px-3 text-slate-300 font-sans">Chave ${tex("K")}</td>
                  <td class="py-2 px-3 font-bold text-amber-400">${enc.keyDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-amber-300">${enc.keyBinary}</td>
                </tr>
                <tr class="bg-teal-950/30 text-white font-bold">
                  <td class="text-left py-2.5 px-3 font-sans text-teal-300">Criptograma ${tex("C = M \\oplus K")}</td>
                  <td class="py-2.5 px-3 text-emerald-400 text-base">${enc.ciphertextDecimal.toString()}</td>
                  <td class="py-2.5 px-3 text-right tracking-widest text-emerald-300 text-base">${enc.ciphertextBinary}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong>Critério do Exercício Atendido:</strong> A mensagem de entrada ${enc.plaintextDecimal.toString()} e a chave ${enc.keyDecimal.toString()} foram introduzidas em base 10, convertidas internamente para cadeias binárias de ${enc.bitLength} bits, submetidas ao operador XOR bit a bit, e o resultado final foi reconvertido para a base decimal 10 (${enc.ciphertextDecimal.toString()}).
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro na encriptação: ${msg}
        </div>
      `;
    }
  }

  function runDecryption(): void {
    try {
      const c = BigInt(msgInput!.value || '0');
      const k = BigInt(keyInput!.value || '0');
      const dec = OtpCipher.decrypt(c, k);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Resultado da Decriptação OTP
            </span>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              Simetria Reversa
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center font-mono text-xs sm:text-sm border-collapse">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800">
                  <th class="text-left py-1.5 px-3">Variável</th>
                  <th class="py-1.5 px-3">Base 10</th>
                  <th class="py-1.5 px-3 text-right">Representação Binária (Bits)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr>
                  <td class="text-left py-2 px-3 text-slate-300 font-sans">Texto Cifrado ${tex("C")}</td>
                  <td class="py-2 px-3 font-bold text-white">${dec.ciphertextDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-slate-300">${dec.ciphertextBinary}</td>
                </tr>
                <tr>
                  <td class="text-left py-2 px-3 text-slate-300 font-sans">Chave ${tex("K")}</td>
                  <td class="py-2 px-3 font-bold text-amber-400">${dec.keyDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-amber-300">${dec.keyBinary}</td>
                </tr>
                <tr class="bg-emerald-950/30 text-white font-bold">
                  <td class="text-left py-2.5 px-3 font-sans text-emerald-300">Mensagem Recuperada ${tex("M = C \\oplus K")}</td>
                  <td class="py-2.5 px-3 text-emerald-400 text-base">${dec.recoveredDecimal.toString()}</td>
                  <td class="py-2.5 px-3 text-right tracking-widest text-emerald-300 text-base">${dec.recoveredBinary}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro na decriptação: ${msg}
        </div>
      `;
    }
  }

  btnGenKey?.addEventListener('click', () => {
    try {
      const m = BigInt(msgInput.value || '1');
      const randomKey = OtpCipher.generateSecureKey(m);
      keyInput.value = randomKey.toString();
      runEncryption();
    } catch {
      keyInput.value = '27';
    }
  });

  btnEncrypt?.addEventListener('click', runEncryption);
  btnDecrypt?.addEventListener('click', runDecryption);

  // Inicializar com a primeira encriptação
  runEncryption();
}

// Controlador de Vigenère
function setupVigenereSimulator(): void {
  const msgInput = document.getElementById('vig-msg-input') as HTMLTextAreaElement | null;
  const keyInput = document.getElementById('vig-key-input') as HTMLInputElement | null;
  const wordCounter = document.getElementById('vig-word-counter');
  const btnEncrypt = document.getElementById('vig-btn-encrypt');
  const btnDecrypt = document.getElementById('vig-btn-decrypt');
  const resultsPanel = document.getElementById('vig-results-panel');

  if (!msgInput || !keyInput || !resultsPanel) return;

  function updateWordCount(): void {
    const text = msgInput!.value.trim();
    const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const isValid = validarMensagem(text);

    if (wordCounter) {
      wordCounter.innerHTML = isValid
        ? `<span class="text-emerald-400 font-semibold">✓ ${count} palavras (Requisito de &ge; 4 palavras atendido)</span>`
        : `<span class="text-amber-400 font-semibold">⚠ ${count} palavras (Mínimo exigido: 4 palavras)</span>`;
    }
  }

  msgInput.addEventListener('input', updateWordCount);
  updateWordCount();

  function runEncryption(): void {
    try {
      const msg = msgInput!.value;
      const key = keyInput!.value;
      const keyAligned = gerarChaveRepetida(msg, key);
      const cipher = vigenereEncrypt(msg, key);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-teal-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
              Resultado da Cifragem Vigenère
            </span>
          </div>

          <div class="space-y-3 font-mono text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 text-xs block mb-1">Mensagem Original:</span>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800 text-white break-all">${msg}</div>
            </div>
            <div>
              <span class="text-slate-400 text-xs block mb-1">Chave Alinhada (Letra a Letra):</span>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800 text-amber-300 break-all">${keyAligned}</div>
            </div>
            <div>
              <span class="text-slate-400 text-xs block mb-1">Texto Cifrado Resultante:</span>
              <div class="p-3 bg-teal-950/30 rounded border border-teal-800/60 text-teal-200 font-bold break-all text-base">${cipher}</div>
            </div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro: ${msg}
        </div>
      `;
    }
  }

  function runDecryption(): void {
    try {
      const cipher = msgInput!.value;
      const key = keyInput!.value;
      const plain = vigenereDecrypt(cipher, key);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Resultado da Decriptação Vigenère
            </span>
          </div>

          <div class="space-y-3 font-mono text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 text-xs block mb-1">Texto Decriptado:</span>
              <div class="p-3 bg-emerald-950/30 rounded border border-emerald-800/60 text-emerald-300 font-bold break-all text-base">${plain}</div>
            </div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro: ${msg}
        </div>
      `;
    }
  }

  btnEncrypt?.addEventListener('click', runEncryption);
  btnDecrypt?.addEventListener('click', runDecryption);
  runEncryption();
}

// Controlador da Cifra de Hill
let hillCurrentDim: 2 | 3 = 2;
let hillMatrixValues: number[][] = [
  [3, 3],
  [2, 5],
];

function setupHillSimulator(): void {
  const btnDim2 = document.getElementById('hill-dim-2');
  const btnDim3 = document.getElementById('hill-dim-3');
  const wordKeyInput = document.getElementById('hill-word-key') as HTMLInputElement | null;
  const keyLenHint = document.getElementById('hill-key-len-hint');
  const matrixGrid = document.getElementById('hill-matrix-grid');
  const diagnosticPanel = document.getElementById('hill-diagnostic-panel');
  const msgInput = document.getElementById('hill-msg-input') as HTMLInputElement | null;
  const btnEncrypt = document.getElementById('hill-btn-encrypt');
  const btnDecrypt = document.getElementById('hill-btn-decrypt');
  const resultsPanel = document.getElementById('hill-results-panel');

  if (!matrixGrid || !diagnosticPanel || !resultsPanel) return;

  function renderMatrixInputs(): void {
    matrixGrid!.className = `grid grid-cols-${hillCurrentDim} gap-2 font-mono max-w-xs`;
    matrixGrid!.innerHTML = '';

    for (let r = 0; r < hillCurrentDim; r++) {
      for (let c = 0; c < hillCurrentDim; c++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '25';
        input.value = (hillMatrixValues[r]?.[c] ?? 0).toString();
        input.className = 'w-full bg-slate-900 border border-slate-800 rounded p-2 text-center text-sm text-white font-mono focus:border-teal-500 focus:outline-none';
        input.addEventListener('input', () => {
          const val = ModularArithmetic.mod(parseInt(input.value || '0', 10));
          if (!hillMatrixValues[r]) hillMatrixValues[r] = [];
          hillMatrixValues[r][c] = val;
          updateWordKeyFromMatrix();
          runDiagnostics();
        });
        matrixGrid!.appendChild(input);
      }
    }
    runDiagnostics();
  }

  function updateWordKeyFromMatrix(): void {
    if (!wordKeyInput) return;
    let word = '';
    for (let r = 0; r < hillCurrentDim; r++) {
      for (let c = 0; c < hillCurrentDim; c++) {
        const val = hillMatrixValues[r][c] ?? 0;
        word += String.fromCharCode(val + 'A'.charCodeAt(0));
      }
    }
    wordKeyInput.value = word;
  }

  function updateMatrixFromWordKey(): void {
    if (!wordKeyInput) return;
    const clean = wordKeyInput.value.toUpperCase().replace(/[^A-Z]/g, '');
    const needed = hillCurrentDim * hillCurrentDim;

    if (clean.length >= needed) {
      let idx = 0;
      hillMatrixValues = [];
      for (let r = 0; r < hillCurrentDim; r++) {
        const row: number[] = [];
        for (let c = 0; c < hillCurrentDim; c++) {
          row.push(clean.charCodeAt(idx) - 'A'.charCodeAt(0));
          idx++;
        }
        hillMatrixValues.push(row);
      }
      renderMatrixInputs();
    }
  }

  wordKeyInput?.addEventListener('input', updateMatrixFromWordKey);

  function runDiagnostics(): boolean {
    const rawDet = ModularMatrix.determinant(hillMatrixValues);
    const modDet = ModularArithmetic.mod(rawDet);
    const gcd = ModularArithmetic.gcd(modDet, 26);
    const isInvertible = gcd === 1;

    let detInvStr = 'Inexistente';
    let invMatrix: number[][] | null = null;

    if (isInvertible) {
      const invDet = ModularArithmetic.modInverse(modDet);
      detInvStr = invDet.toString();
      try {
        invMatrix = ModularMatrix.inverse(hillMatrixValues);
      } catch {
        invMatrix = null;
      }
    }

    diagnosticPanel!.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <span class="text-slate-400">Diagnóstico Algébrico:</span>
        ${
          isInvertible
            ? `<span class="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 font-bold">✓ Matriz Inversível em Z_26 (Válida)</span>`
            : `<span class="px-2 py-0.5 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold">✗ Matriz Singular em Z_26 (Não Inversível)</span>`
        }
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div>
          <span class="text-slate-400 block">det(K) bruto:</span>
          <span class="text-white font-bold">${rawDet}</span>
        </div>
        <div>
          <span class="text-slate-400 block">det(K) mod 26:</span>
          <span class="text-teal-300 font-bold">${modDet}</span>
        </div>
        <div>
          <span class="text-slate-400 block">mdc(det, 26):</span>
          <span class="font-bold ${gcd === 1 ? 'text-emerald-400' : 'text-red-400'}">${gcd}</span>
        </div>
        <div>
          <span class="text-slate-400 block">det^-1 mod 26:</span>
          <span class="text-amber-300 font-bold">${detInvStr}</span>
        </div>
      </div>

      ${
        !isInvertible
          ? `<div class="p-2 rounded bg-red-950/30 border border-red-800/40 text-red-300 text-[11px] mt-2">
              Aviso: mdc(${modDet}, 26) = ${gcd} &ne; 1. O determinante compartilha fatores com 26 (2 ou 13), impedindo a inversão da matriz. A decriptação é matematicamente impossível com esta chave.
            </div>`
          : invMatrix
          ? `<div class="mt-3 pt-2 border-t border-slate-900">
              <span class="text-slate-400 block mb-1">Matriz Inversa Calculada K^-1 (mod 26):</span>
              <div class="inline-block p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs">
                ${invMatrix.map((row) => `[ ${row.join(', ')} ]`).join('<br>')}
              </div>
            </div>`
          : ''
      }
    `;

    return isInvertible;
  }

  btnDim2?.addEventListener('click', () => {
    hillCurrentDim = 2;
    hillMatrixValues = [
      [3, 3],
      [2, 5],
    ];
    btnDim2.className = 'px-2.5 py-1 text-xs rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono font-bold';
    btnDim3!.className = 'px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700 font-mono';
    if (keyLenHint) keyLenHint.textContent = '4 letras para 2x2';
    updateWordKeyFromMatrix();
    renderMatrixInputs();
  });

  btnDim3?.addEventListener('click', () => {
    hillCurrentDim = 3;
    hillMatrixValues = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0],
    ];
    btnDim3.className = 'px-2.5 py-1 text-xs rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono font-bold';
    btnDim2!.className = 'px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700 font-mono';
    if (keyLenHint) keyLenHint.textContent = '9 letras para 3x3';
    updateWordKeyFromMatrix();
    renderMatrixInputs();
  });

  function runEncryption(): void {
    try {
      const text = msgInput!.value;
      const enc = HillCipher.encrypt(text, hillMatrixValues);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-teal-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
              Resultado da Cifragem de Hill
            </span>
            <span class="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono">
              ${enc.blockTransformations.length} Blocos &bull; Padding: ${enc.paddingCount} caractere(s)
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span class="text-slate-400 block mb-1">Texto Claro Formatado (com Padding 'X'):</span>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800 text-white text-sm tracking-wider">${enc.plaintextFormatted}</div>
            </div>
            <div>
              <span class="text-slate-400 block mb-1">Texto Cifrado Resultante:</span>
              <div class="p-2.5 bg-teal-950/40 rounded border border-teal-800/60 text-teal-300 text-sm font-bold tracking-wider">${enc.ciphertext}</div>
            </div>
          </div>

          <!-- Tabela de Transformação Bloco a Bloco -->
          <div>
            <span class="text-xs text-slate-400 font-semibold block mb-2">Transformação Matricial por Vetores:</span>
            <div class="overflow-x-auto">
              <table class="w-full text-center font-mono text-xs border-collapse">
                <thead>
                  <tr class="text-slate-400 border-b border-slate-800">
                    <th class="py-1 px-2 text-left">Bloco</th>
                    <th class="py-1 px-2">Digrama/Trigrama</th>
                    <th class="py-1 px-2">Vetor Entrada P</th>
                    <th class="py-1 px-2">Vetor C = K*P (mod 26)</th>
                    <th class="py-1 px-2 text-right">Bloco Cifrado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${enc.blockTransformations
                    .map(
                      (b) => `
                    <tr>
                      <td class="py-2 px-2 text-left text-slate-400">#${b.blockIndex + 1}</td>
                      <td class="py-2 px-2 font-bold text-white">${b.inputChars}</td>
                      <td class="py-2 px-2 text-teal-300">[ ${b.inputVector.join(', ')} ]</td>
                      <td class="py-2 px-2 text-emerald-300 font-bold">[ ${b.outputVector.join(', ')} ]</td>
                      <td class="py-2 px-2 text-right font-bold text-teal-400">${b.outputChars}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro na encriptação de Hill: ${msg}
        </div>
      `;
    }
  }

  function runDecryption(): void {
    try {
      const text = msgInput!.value;
      const dec = HillCipher.decrypt(text, hillMatrixValues);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Resultado da Decriptação de Hill
            </span>
          </div>

          <div class="space-y-3 font-mono text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 text-xs block mb-1">Texto Decriptado com Sucesso:</span>
              <div class="p-3 bg-emerald-950/30 rounded border border-emerald-800/60 text-emerald-300 font-bold break-all text-base">${dec}</div>
            </div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          Erro na decriptação de Hill: ${msg}
        </div>
      `;
    }
  }

  btnEncrypt?.addEventListener('click', runEncryption);
  btnDecrypt?.addEventListener('click', runDecryption);

  renderMatrixInputs();
  runEncryption();
}

// Renderizador da tela principal
function renderActiveTab(): void {
  const app = document.getElementById('app');
  if (!app) return;

  updateTabButtons();

  switch (activeTab) {
    case 'visao-geral':
      app.innerHTML = renderVisaoGeral();
      break;
    case 'otp':
      app.innerHTML = renderOtpTab();
      setupOtpSimulator();
      break;
    case 'vigenere':
      app.innerHTML = renderVigenereTab();
      setupVigenereSimulator();
      break;
    case 'hill':
      app.innerHTML = renderHillTab();
      setupHillSimulator();
      break;
    default:
      app.innerHTML = renderVisaoGeral();
  }

  setupTabs();
}

// Iniciar aplicação
document.addEventListener('DOMContentLoaded', () => {
  renderActiveTab();
});
