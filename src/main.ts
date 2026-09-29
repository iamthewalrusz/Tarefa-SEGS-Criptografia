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

// Biblioteca de ícones SVG minimalistas (sem emojis)
const icons = {
  shield: `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  lock: `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  unlock: `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>`,
  key: `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>`,
  arrowRight: `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  check: `<svg class="w-3.5 h-3.5 inline-block text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  alert: `<svg class="w-3.5 h-3.5 inline-block text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  play: `<svg class="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
  matrix: `<svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
};

// Estado da aplicação
let activeTab = 'visao-geral';

// Controle de Tema (Dark / Light)
function initTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  const homeBtn = document.getElementById('header-home-btn');
  homeBtn?.addEventListener('click', () => {
    activeTab = 'visao-geral';
    renderActiveTab();
  });
}

// ==========================================
// VIEW: PÁGINA INICIAL (SÓBRIA E MINIMALISTA)
// ==========================================
function renderVisaoGeral(): string {
  return `
    <div class="space-y-8 animate-fadeIn">
      <!-- Apresentação Institucional Sóbria -->
      <section class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-6 sm:p-8">
        <div class="max-w-3xl space-y-3">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium border border-slate-200 dark:border-slate-700">
            <span>Segurança de Sistemas</span>
            <span>&bull;</span>
            <span>Criptografia Simétrica e Algébrica</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Plataforma Analítica de Algoritmos Criptográficos
          </h2>
          <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Ambiente computacional voltado ao estudo comparativo, dedução formal e simulação de primitivas criptográficas clássicas e modernas.
            Todos os algoritmos foram concebidos em <strong>TypeScript</strong> puro, contemplando análise de integridade, determinantes modulares e aritmética em anéis finitos.
          </p>
        </div>
      </section>

      <!-- Menu Principal de Navegação (Cards Minimalistas sem Nomes ou Status) -->
      <div>
        <h3 class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Módulos Criptográficos Disponíveis
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Card 1: OTP -->
          <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Módulo 01</span>
                <span>Fita Única</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>One-Time Pad (OTP)</span>
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cifragem por fluxo binário com entradas e saídas decimais na base 10. Dedução do sigilo incondicional de Shannon e demonstração da vulnerabilidade crítica de reutilização da chave.
              </p>
            </div>
            <button class="mt-5 nav-jump inline-flex items-center justify-between w-full px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition" data-jump="otp">
              <span>Acessar Módulo</span>
              <span>${icons.arrowRight}</span>
            </button>
          </div>

          <!-- Card 2: Vigenère -->
          <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Módulo 02</span>
                <span>Polialfabético</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Cifra de Vigenère</span>
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Substituição polialfabética periódica com alinhamento alfabético contínuo da chave e validação obrigatória de frases com no mínimo quatro palavras.
              </p>
            </div>
            <button class="mt-5 nav-jump inline-flex items-center justify-between w-full px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition" data-jump="vigenere">
              <span>Acessar Módulo</span>
              <span>${icons.arrowRight}</span>
            </button>
          </div>

          <!-- Card 3: Hill -->
          <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Módulo 03</span>
                <span>Álgebra Linear</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Cifra de Hill</span>
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transformações lineares no anel modular Z_26 para ordens 2x2 e 3x3. Análise diagnóstica de invertibilidade, determinantes e matriz adjunta inversa via Euclides Estendido.
              </p>
            </div>
            <button class="mt-5 nav-jump inline-flex items-center justify-between w-full px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition" data-jump="hill">
              <span>Acessar Módulo</span>
              <span>${icons.arrowRight}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// VIEW: ONE-TIME PAD (OTP)
// ==========================================
function renderOtpTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Criptografia de Fluxo &bull; Primitiva Involutiva</div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          One-Time Pad (OTP) e a Operação XOR Decimal
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Origem do termo "One-Time", dedução do segredo perfeito de Shannon e a catástrofe criptográfica da reutilização de chave.
        </p>
      </div>

      <!-- Seção 1: Origem Epistemológica e Por que se chama "One-Time" -->
      <section class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          1. Origem Epistemológica e o Conceito de "One-Time Pad"
        </h3>
        <p>
          O nome <strong>One-Time Pad</strong> provém diretamente de sua implementação física original nas telecomunicações diplomáticas e militares do início do século XX.
          As partes comunicantes recebiam cadernos ou blocos de folhas de papel destacáveis — denominados <em>pads</em>.
          Cada folha do bloco continha uma sequência de números ou caracteres verdadeiramente aleatórios impressos, compartilhada previamente entre o emissor e o receptor.
        </p>
        <p>
          O protocolo operacional de segurança exigia que cada folha fosse utilizada para cifrar estritamente uma única mensagem (<strong>one-time</strong>) e,
          imediatamente após a transmissão, a folha correspondente do <em>pad</em> fosse <strong>fisicamente destacada e destruída</strong> (frequentemente incinerada).
          Dessa rotina de uso único decorre a denominação formal da técnica.
        </p>
        <p>
          Em 1949, <strong>Claude Shannon</strong> formulou a teoria matemática do sigilo perfeito (<em>perfect secrecy</em>).
          Shannon demonstrou que, se a chave ${tex("K")} for:
        </p>
        <ol class="list-decimal list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-300">
          <li>Verdadeiramente aleatória (entropia máxima, equiprovável);</li>
          <li>De comprimento no mínimo idêntico ao da mensagem (${tex("|K| \\ge |M|")});</li>
          <li><strong>Nunca reutilizada sob nenhuma hipótese</strong>;</li>
        </ol>
        <p>
          o criptograma ${tex("C")} é estatisticamente independente da mensagem original ${tex("M")}, tornando impossível qualquer quebra por criptoanálise,
          independentemente de quanto poder computacional o adversário disponha:
        </p>
        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-3 rounded-md border border-slate-200 dark:border-slate-800">
          ${tex("\\mathbb{P}(M = m \\mid C = c) = \\mathbb{P}(M = m), \\quad \\forall m \\in \\mathcal{M}", true)}
        </div>
      </section>

      <!-- Seção 2: O Risco Crítico da Reutilização de Chave (Two-Time Pad) -->
      <section class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          2. A Catástrofe da Reutilização de Chave: Por que a Chave Deve Ser Descartada?
        </h3>
        <p>
          A exigência de que a chave seja descartada após um único uso não é uma recomendação empírica de boas práticas, mas sim um <strong>requisito matemático fundamental</strong>.
          Quando um emissor comete o erro fatal de cifrar duas mensagens distintas (${tex("M_1")} e ${tex("M_2")}) utilizando a mesma chave ${tex("K")},
          o sistema entra em colapso criptográfico absoluto. Esse cenário é conhecido na literatura como o ataque <strong>Two-Time Pad</strong>.
        </p>

        <p>
          Considere os dois textos cifrados interceptados pelo adversário:
        </p>
        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-2.5 rounded-md border border-slate-200 dark:border-slate-800">
          ${tex("C_1 = M_1 \\oplus K \\quad \\text{e} \\quad C_2 = M_2 \\oplus K", true)}
        </div>

        <p>
          Se o adversário aplicar a operação XOR entre os dois criptogramas interceptados, a chave ${tex("K")} se anula por auto-cancelamento:
        </p>
        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-3 rounded-md border border-slate-200 dark:border-slate-800">
          ${tex("C_1 \\oplus C_2 = (M_1 \\oplus K) \\oplus (M_2 \\oplus K) = M_1 \\oplus M_2 \\oplus (K \\oplus K) = M_1 \\oplus M_2", true)}
        </div>

        <!-- Alerta e Decodificação do Two-Time Pad -->
        <div class="border-l-4 border-amber-500 bg-amber-500/10 dark:bg-amber-950/20 p-4 rounded-r-md space-y-2">
          <div class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>${icons.alert}</span>
            <span>Consequência Analítica da Reutilização:</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            A chave ${tex("K")} desaparece completamente da equação. O adversário agora possui ${tex("M_1 \\oplus M_2")}.
            Em textos de linguagem natural (como a codificação ASCII), o caractere de espaço em branco (código 32 ou <code>0x20</code>) possui apenas o sexto bit ativo.
            Quando o espaço sofre XOR com uma letra do alfabeto, ele simplesmente inverte a caixa da letra (maiúscula/minúscula).
            Através de heurísticas de frequência e reconhecimento de palavras de dicionário, é possível derivar ${tex("M_1")} e ${tex("M_2")} recursivamente sem jamais conhecer a chave ${tex("K")}.
          </p>
        </div>
      </section>

      <!-- Seção 3: Formulação do Exercício (Decimal e Binário) -->
      <section class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          3. Formulação Técnica do Exercício Acadêmico
        </h3>
        <p>
          O exercício 1 estipula a manipulação dos valores em base 10 (sistema decimal), exigindo que a conversão para base 2 conste explicitamente no algoritmo:
        </p>

        <div class="border-l-4 border-slate-500 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-r-md space-y-2">
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Relação de Notação e Etapas Algorítmicas:
          </div>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li><strong>${tex("M_{10}")}</strong>: Mensagem em claro informada como inteiro decimal (${tex("M \\ge 0")}).</li>
            <li><strong>${tex("K_{10}")}</strong>: Chave aleatória informada como inteiro decimal (${tex("K \\ge 0")}).</li>
            <li><strong>${tex("\\operatorname{dec2bin}(n)")}</strong>: Algoritmo de divisões sucessivas por 2 que produz a cadeia binária.</li>
            <li><strong>${tex("\\operatorname{bin2dec}(b)")}</strong>: Reconstrução posicional por potências de 2: ${tex("\\sum_{i=0}^{L-1} b_i 2^{L-1-i}")}.</li>
            <li><strong>${tex("C_{10} = \\operatorname{bin2dec}(\\operatorname{dec2bin}(M_{10}) \\oplus \\operatorname{dec2bin}(K_{10}))")}</strong>: Criptograma em base decimal.</li>
          </ul>
        </div>
      </section>

      <!-- Seção 4: Demonstrações Visuais Didáticas -->
      <section class="space-y-8">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          4. Demonstrações Visuais em Vídeo
        </h3>

        <!-- Vídeo 1: Cifragem e Decifragem Passo a Passo -->
        <div class="space-y-2">
          <h4 class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center">
            Demonstração 1: Cifragem e Decifragem Passo a Passo (Decimal &harr; Binário &harr; XOR)
          </h4>
          <figure class="flex flex-col items-center justify-center my-4">
            <div class="w-full sm:w-4/5 md:w-3/4 max-w-3xl aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-black shadow-sm">
              <video controls autoplay loop muted playsinline class="w-full h-full object-contain block">
                <source src="./assets/videos/otpstepbystepscene.mp4" type="video/mp4">
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <figcaption class="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Animação passo a passo: cifragem completa de <i>M=42</i> com <i>K=27</i> gerando <i>C=49</i>, seguida pela demonstração visual da decifragem simétrica <i>C &oplus; K</i> recuperando com exatidão a mensagem original <i>M=42</i>.
            </figcaption>
          </figure>
        </div>

        <!-- Vídeo 2: A Catástrofe da Reutilização de Chave (Two-Time Pad) -->
        <div class="space-y-2 pt-4">
          <h4 class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center">
            Demonstração 2: A Quebra do Sigilo por Reutilização de Chave (Two-Time Pad)
          </h4>
          <figure class="flex flex-col items-center justify-center my-4">
            <div class="w-full sm:w-4/5 md:w-3/4 max-w-3xl aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-black shadow-sm">
              <video controls autoplay loop muted playsinline class="w-full h-full object-contain block">
                <source src="./assets/videos/otptwotimepadscene.mp4" type="video/mp4">
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <figcaption class="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Animação com scanner bit a bit: o adversário calcula <i>C₁ &oplus; C₂</i> e o leitor percorre cada coluna demonstrando a anulação da chave (<i>K &oplus; K = 0</i>), expondo diretamente <i>M₁ &oplus; M₂</i> e revelando as mensagens originais sem a chave secreta.
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- Seção 5: Simulador Interativo OTP -->
      <section class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-6 space-y-6">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Bancada de Teste: Simulador OTP</span>
            <span class="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-300 dark:border-slate-700">Base 10</span>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Insira os valores decimais para visualizar a conversão binária e a operação XOR bit a bit.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Mensagem Clara (Base 10)
            </label>
            <input
              type="number"
              id="otp-msg-input"
              value="42"
              min="0"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition"
              placeholder="Ex: 42"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                Chave (Base 10)
              </label>
              <button
                type="button"
                id="otp-btn-gen-key"
                class="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono underline"
              >
                Gerar Chave Aleatória
              </button>
            </div>
            <input
              type="number"
              id="otp-key-input"
              value="27"
              min="0"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition"
              placeholder="Ex: 27"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="otp-btn-encrypt"
            class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition"
          >
            Cifrar Mensagem
          </button>
          <button
            type="button"
            id="otp-btn-decrypt"
            class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
          >
            Decifrar Criptograma
          </button>
        </div>

        <div id="otp-results-panel" class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
          <!-- Dinâmico -->
        </div>
      </section>

      <!-- Referências Bibliográficas -->
      <section class="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <h4 class="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] font-mono">Referências Bibliográficas</h4>
        <p>1. SHANNON, Claude E. <em>Communication Theory of Secrecy Systems</em>. Bell System Technical Journal, v. 28, n. 4, p. 656–715, 1949.</p>
        <p>2. VERNAM, Gilbert S. <em>Cipher Printing Telegraph Systems For Secret Wire and Radio Telegraphic Communications</em>. Transactions of the AIEE, v. 45, p. 295–301, 1926.</p>
      </section>
    </div>
  `;
}

// ==========================================
// VIEW: CIFRA DE VIGENÈRE
// ==========================================
function renderVigenereTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Substituição Polialfabética Periódica</div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          Cifra de Vigenère
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Implementação em TypeScript a partir do código original de João Vitor, com alinhamento cíclico e critério de 4 palavras.
        </p>
      </div>

      <section class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          1. Origem Epistemológica e Contexto Histórico
        </h3>
        <p>
          Apresentada originariamente pelo criptologista italiano <strong>Giovan Battista Bellaso em 1553</strong> e equivocadamente atribuída a Blaise de Vigenère no século XIX,
          esta técnica representou a superação da cifra monoalfabética de César. Ao empregar uma palavra-chave para ciclar entre múltiplos alfabetos deslocados,
          as frequências unigramáticas das letras são espalhadas, frustrando leituras imediatas até a introdução do Teste de Kasiski em 1863.
        </p>

        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-3 rounded-md border border-slate-200 dark:border-slate-800 space-y-1">
          <div>${tex("c_i = (m_i + k_{i \\pmod L}) \\pmod{26} \\quad \\text{(Cifragem)}", true)}</div>
          <div>${tex("m_i = (c_i - k_{i \\pmod L} + 26) \\pmod{26} \\quad \\text{(Decifragem)}", true)}</div>
        </div>

        <div class="border-l-4 border-slate-500 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-r-md space-y-2">
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Critérios do Exercício Acadêmico:
          </div>
          <ul class="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>A mensagem deve ser uma frase contendo <strong>no mínimo quatro palavras</strong>.</li>
            <li>A chave é repetida ciclicamente até atingir o comprimento da mensagem, alinhando-se estritamente com caracteres alfabéticos.</li>
            <li>Caracteres não alfabéticos e espaçamentos originais são conservados.</li>
          </ul>
        </div>
      </section>

      <!-- Bancada Interativa Vigenère -->
      <section class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-6 space-y-6">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Bancada de Teste: Simulador Vigenère</span>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validação em tempo real do requisito de no mínimo 4 palavras.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Mensagem (Mínimo de 4 palavras)
            </label>
            <textarea
              id="vig-msg-input"
              rows="2"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-3 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition"
              placeholder="Digite ao menos quatro palavras..."
            >A cifra de Vigenere e polialfabetica</textarea>
            <div id="vig-word-counter" class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono"></div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Chave de Acesso
            </label>
            <input
              type="text"
              id="vig-key-input"
              value="CHAVE"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition"
              placeholder="Ex: CHAVE"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="vig-btn-encrypt"
            class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition"
          >
            Cifrar Mensagem
          </button>
          <button
            type="button"
            id="vig-btn-decrypt"
            class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
          >
            Decifrar Criptograma
          </button>
        </div>

        <div id="vig-results-panel" class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
          <!-- Dinâmico -->
        </div>
      </section>
    </div>
  `;
}

// ==========================================
// VIEW: CIFRA DE HILL
// ==========================================
function renderHillTab(): string {
  return `
    <div class="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <div class="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Criptografia Poligráfica &bull; Álgebra Linear Modular</div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          Cifra de Hill e Matrizes Inversas sobre ${tex("\\mathbb{Z}_{26}")}
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Transformações lineares afins, cálculo exato de determinantes, Euclides Estendido e matriz adjunta modular.
        </p>
      </div>

      <!-- Seção 1: Contexto Histórico e Formulação -->
      <section class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          1. Origem Epistemológica e Fundamentação Algébrica
        </h3>
        <p>
          Proposta por <strong>Lester S. Hill em 1929</strong>, a Cifra de Hill marcou a entrada formal da Álgebra Linear na ciência criptológica.
          O texto claro é particionado em blocos de ${tex("n")} caracteres, tratados como vetores de coordenadas ${tex("\\mathbf{p} = [p_1, \\dots, p_n]^T")} no espaço modular ${tex("\\mathbb{Z}_{26}^n")}.
          A transformação linear de cifragem e sua decriptação são formuladas como:
        </p>

        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-3 rounded-md border border-slate-200 dark:border-slate-800 space-y-1">
          <div>${tex("\\mathbf{c} \\equiv K \\cdot \\mathbf{p} \\pmod{26} \\quad \\text{(Cifragem)}", true)}</div>
          <div>${tex("\\mathbf{p} \\equiv K^{-1} \\cdot \\mathbf{c} \\pmod{26} \\quad \\text{(Decifragem)}", true)}</div>
        </div>

        <!-- Teorema da Invertibilidade -->
        <div class="border-l-4 border-slate-500 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-r-md space-y-2">
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Condição Teórica para Invertibilidade no Anel ${tex("\\mathbb{Z}_{26}")}:
          </div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            A matriz de chave ${tex("K")} admite inversa modular se e somente se o determinante for coprimo com 26:
          </p>
          <div class="math-block py-1">
            ${tex("\\gcd(\\det(K) \\pmod{26}, 26) = 1", true)}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Como ${tex("26 = 2 \\times 13")}, a matriz só possui inversa se ${tex("\\det(K)")} for <strong>ímpar</strong> e <strong>não for divisível por 13</strong>.
          </p>
        </div>

        <p>
          A matriz inversa modular ${tex("K^{-1}")} é computada pela fórmula da matriz adjunta:
        </p>
        <div class="math-block bg-slate-100 dark:bg-slate-900/60 p-3 rounded-md border border-slate-200 dark:border-slate-800">
          ${tex("K^{-1} \\equiv (\\det K)^{-1} \\cdot \\operatorname{adj}(K) \\pmod{26}", true)}
        </div>
      </section>

      <!-- Seção 2: Demonstrações Visuais Didáticas -->
      <section class="space-y-8">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          2. Demonstrações Visuais em Vídeo
        </h3>

        <!-- Vídeo 1: Codificação no Espaço Modular 2D -->
        <div class="space-y-2">
          <h4 class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center">
            Demonstração 1: Codificação Matricial 2D no Espaço Modular (Passo a Passo)
          </h4>
          <figure class="flex flex-col items-center justify-center my-4">
            <div class="w-full sm:w-4/5 md:w-3/4 max-w-3xl aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-black shadow-sm">
              <video controls autoplay loop muted playsinline class="w-full h-full object-contain block">
                <source src="./assets/videos/hillencodescene.mp4" type="video/mp4">
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <figcaption class="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Animação vetorial calma: codificação detalhada do 1º bloco <i>"CR" &rarr; p₁=(2, 17) &rarr; c₁=(5, 11) &rarr; "FL"</i> no espaço discreto ℤ₂₆, seguida pela transformação sequencial dos blocos seguintes gerando o criptograma <i>"FLRNVE"</i> a partir de <i>"CRIPTO"</i>.
            </figcaption>
          </figure>
        </div>

        <!-- Vídeo 2: Decodificação com a Matriz Inversa Modular -->
        <div class="space-y-2 pt-4">
          <h4 class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center">
            Demonstração 2: Decodificação com a Matriz Inversa Modular K⁻¹
          </h4>
          <figure class="flex flex-col items-center justify-center my-4">
            <div class="w-full sm:w-4/5 md:w-3/4 max-w-3xl aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-black shadow-sm">
              <video controls autoplay loop muted playsinline class="w-full h-full object-contain block">
                <source src="./assets/videos/hilldecodescene.mp4" type="video/mp4">
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>
            <figcaption class="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Animação analítica: decodificação detalhada do 1º bloco <i>c₁=(5, 11)</i> multiplicando pela matriz inversa <i>K⁻¹</i> restaurando <i>(2, 17) &rarr; "CR"</i>, com reversão progressiva dos blocos seguintes e recuperação integral da palavra <i>"CRIPTO"</i>.
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- Seção 3: Simulador Interativo Hill -->
      <section class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md p-6 space-y-6">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Bancada de Teste: Simulador Hill</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">Ordem:</span>
              <button type="button" id="hill-dim-2" class="px-2.5 py-1 text-xs rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold">
                2 &times; 2
              </button>
              <button type="button" id="hill-dim-3" class="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-mono">
                3 &times; 3
              </button>
            </div>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Diagnóstico analítico em tempo real do determinante e matriz inversa modular.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                Chave em Palavra
              </label>
              <span class="text-[11px] text-slate-500 font-mono" id="hill-key-len-hint">4 letras para 2x2</span>
            </div>
            <input
              type="text"
              id="hill-word-key"
              value="DDCF"
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition uppercase"
              placeholder="Ex: DDCF"
            />
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Ou ajuste os coeficientes diretamente na matriz numérica ao lado:
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Matriz de Chave K (mod 26)
            </label>
            <div id="hill-matrix-grid" class="grid gap-2 font-mono">
              <!-- Renderizado dinamicamente -->
            </div>
          </div>
        </div>

        <!-- Diagnóstico da Matriz em Tempo Real -->
        <div id="hill-diagnostic-panel" class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-2 text-xs font-mono">
          <!-- Renderizado dinamicamente -->
        </div>

        <!-- Mensagem de Entrada -->
        <div class="space-y-3">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Mensagem para Cifragem / Decifragem
          </label>
          <input
            type="text"
            id="hill-msg-input"
            value="CRIPTO"
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-500 transition uppercase"
            placeholder="Ex: CRIPTO"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="hill-btn-encrypt"
            class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition"
          >
            Cifrar em Blocos
          </button>
          <button
            type="button"
            id="hill-btn-decrypt"
            class="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
          >
            Decifrar com Inversa K^-1
          </button>
        </div>

        <div id="hill-results-panel" class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
          <!-- Dinâmico -->
        </div>
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
      btn.className = 'tab-btn px-3 py-1.5 rounded-md transition bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium';
    } else {
      btn.className = 'tab-btn px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium';
    }
  });
}

// ==========================================
// CONTROLADORES DOS SIMULADORES
// ==========================================

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
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              Resultado da Cifragem OTP
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              Alinhamento: ${enc.bitLength} bits
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th class="text-left py-1.5 px-3">Variável</th>
                  <th class="py-1.5 px-3">Base 10</th>
                  <th class="py-1.5 px-3 text-right">Representação Binária</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60">
                <tr>
                  <td class="text-left py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">Mensagem Clara M</td>
                  <td class="py-2 px-3 font-bold">${enc.plaintextDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-slate-600 dark:text-slate-300">${enc.plaintextBinary}</td>
                </tr>
                <tr>
                  <td class="text-left py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">Chave K</td>
                  <td class="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">${enc.keyDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-amber-600 dark:text-amber-300">${enc.keyBinary}</td>
                </tr>
                <tr class="bg-slate-100 dark:bg-slate-900/60 font-bold">
                  <td class="text-left py-2.5 px-3 font-sans text-slate-900 dark:text-white">Criptograma C = M XOR K</td>
                  <td class="py-2.5 px-3 text-slate-900 dark:text-white text-sm">${enc.ciphertextDecimal.toString()}</td>
                  <td class="py-2.5 px-3 text-right tracking-widest text-slate-900 dark:text-white text-sm">${enc.ciphertextBinary}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
          Erro: ${msg}
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
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              Resultado da Decriptação OTP
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              Simetria Involutiva
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th class="text-left py-1.5 px-3">Variável</th>
                  <th class="py-1.5 px-3">Base 10</th>
                  <th class="py-1.5 px-3 text-right">Representação Binária</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60">
                <tr>
                  <td class="text-left py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">Texto Cifrado C</td>
                  <td class="py-2 px-3 font-bold">${dec.ciphertextDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-slate-600 dark:text-slate-300">${dec.ciphertextBinary}</td>
                </tr>
                <tr>
                  <td class="text-left py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">Chave K</td>
                  <td class="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">${dec.keyDecimal.toString()}</td>
                  <td class="py-2 px-3 text-right tracking-widest text-amber-600 dark:text-amber-300">${dec.keyBinary}</td>
                </tr>
                <tr class="bg-slate-100 dark:bg-slate-900/60 font-bold">
                  <td class="text-left py-2.5 px-3 font-sans text-slate-900 dark:text-white">Mensagem Recuperada M</td>
                  <td class="py-2.5 px-3 text-slate-900 dark:text-white text-sm">${dec.recoveredDecimal.toString()}</td>
                  <td class="py-2.5 px-3 text-right tracking-widest text-slate-900 dark:text-white text-sm">${dec.recoveredBinary}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
          Erro: ${msg}
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
  runEncryption();
}

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
        ? `<span class="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">${icons.check} ${count} palavras (Requisito de no mínimo 4 palavras atendido)</span>`
        : `<span class="text-amber-600 dark:text-amber-400 font-semibold font-mono">${icons.alert} ${count} palavras (Mínimo exigido: 4 palavras)</span>`;
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
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-3 font-mono text-xs">
          <div>
            <span class="text-slate-500 block mb-1">Chave Alinhada (Caractere a Caractere):</span>
            <div class="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-300 break-all">${keyAligned}</div>
          </div>
          <div>
            <span class="text-slate-500 block mb-1">Criptograma Resultante:</span>
            <div class="p-2.5 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold break-all text-sm">${cipher}</div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
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
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-3 font-mono text-xs">
          <div>
            <span class="text-slate-500 block mb-1">Texto Decifrado:</span>
            <div class="p-2.5 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold break-all text-sm">${plain}</div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
          Erro: ${msg}
        </div>
      `;
    }
  }

  btnEncrypt?.addEventListener('click', runEncryption);
  btnDecrypt?.addEventListener('click', runDecryption);
  runEncryption();
}

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
        input.className = 'w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded p-2 text-center text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:border-slate-500 focus:outline-none';
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
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span class="text-slate-500 dark:text-slate-400 font-mono">Diagnóstico Algébrico:</span>
        ${
          isInvertible
            ? `<span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold font-mono">${icons.check} Matriz Inversível em Z_26</span>`
            : `<span class="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold font-mono">${icons.alert} Matriz Singular (Não Inversível)</span>`
        }
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        <div>
          <span class="text-slate-500 block">det(K) bruto:</span>
          <span class="text-slate-900 dark:text-white font-bold">${rawDet}</span>
        </div>
        <div>
          <span class="text-slate-500 block">det(K) mod 26:</span>
          <span class="text-slate-900 dark:text-white font-bold">${modDet}</span>
        </div>
        <div>
          <span class="text-slate-500 block">mdc(det, 26):</span>
          <span class="font-bold ${gcd === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">${gcd}</span>
        </div>
        <div>
          <span class="text-slate-500 block">det^-1 mod 26:</span>
          <span class="text-slate-900 dark:text-white font-bold">${detInvStr}</span>
        </div>
      </div>

      ${
        !isInvertible
          ? `<div class="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-[11px] mt-2 leading-relaxed">
              O determinante compartilha fatores com 26 (mdc = ${gcd}). A matriz não admite inverso multiplicativo em Z_26, inviabilizando a decriptação.
            </div>`
          : invMatrix
          ? `<div class="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span class="text-slate-500 block mb-1">Matriz Inversa Calculada K^-1 (mod 26):</span>
              <div class="inline-block p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs">
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
    btnDim2.className = 'px-2.5 py-1 text-xs rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold';
    btnDim3!.className = 'px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-mono';
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
    btnDim3.className = 'px-2.5 py-1 text-xs rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold';
    btnDim2!.className = 'px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-mono';
    if (keyLenHint) keyLenHint.textContent = '9 letras para 3x3';
    updateWordKeyFromMatrix();
    renderMatrixInputs();
  });

  function runEncryption(): void {
    try {
      const text = msgInput!.value;
      const enc = HillCipher.encrypt(text, hillMatrixValues);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
              Resultado da Cifragem de Hill
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              ${enc.blockTransformations.length} Blocos &bull; Padding: ${enc.paddingCount} char
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span class="text-slate-500 block mb-1">Texto Claro com Padding 'X':</span>
              <div class="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm tracking-wider">${enc.plaintextFormatted}</div>
            </div>
            <div>
              <span class="text-slate-500 block mb-1">Criptograma Resultante:</span>
              <div class="p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold tracking-wider">${enc.ciphertext}</div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th class="py-1 px-2 text-left">Bloco</th>
                  <th class="py-1 px-2">Digrama</th>
                  <th class="py-1 px-2">Vetor Entrada P</th>
                  <th class="py-1 px-2">Vetor C = K*P (mod 26)</th>
                  <th class="py-1 px-2 text-right">Bloco Cifrado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60">
                ${enc.blockTransformations
                  .map(
                    (b) => `
                  <tr>
                    <td class="py-2 px-2 text-left text-slate-500">#${b.blockIndex + 1}</td>
                    <td class="py-2 px-2 font-bold">${b.inputChars}</td>
                    <td class="py-2 px-2 text-slate-600 dark:text-slate-300">[ ${b.inputVector.join(', ')} ]</td>
                    <td class="py-2 px-2 font-bold text-slate-900 dark:text-white">[ ${b.outputVector.join(', ')} ]</td>
                    <td class="py-2 px-2 text-right font-bold text-slate-900 dark:text-white">${b.outputChars}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
          Erro: ${msg}
        </div>
      `;
    }
  }

  function runDecryption(): void {
    try {
      const text = msgInput!.value;
      const dec = HillCipher.decrypt(text, hillMatrixValues);

      resultsPanel!.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-3 font-mono text-xs">
          <div>
            <span class="text-slate-500 block mb-1">Texto Decifrado via Inversa K^-1:</span>
            <div class="p-2.5 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold break-all text-sm">${dec}</div>
          </div>
        </div>
      `;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resultsPanel!.innerHTML = `
        <div class="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-mono">
          Erro: ${msg}
        </div>
      `;
    }
  }

  btnEncrypt?.addEventListener('click', runEncryption);
  btnDecrypt?.addEventListener('click', runDecryption);

  renderMatrixInputs();
  runEncryption();
}

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

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderActiveTab();
});
