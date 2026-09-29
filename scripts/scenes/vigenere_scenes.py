"""
vigenere_scenes.py - Cenas Manim para demonstração didática da Cifra de Vigenère.
Contém:
1. VigenereEncodeScene: Cifragem polialfabética, alinhamento cíclico da chave e achatamento do histograma.
2. VigenereDecodeScene: Decifragem modular, inversão do deslocamento com normalização (+26) e recuperação do texto.
3. VigenereKasiskiScene: Criptanálise de Kasiski, detecção de trigramas repetidos, cálculo do MDC e fatiamento em cifras de César.
"""

from manim import *

EMERALD = "#10b981"
AMBER_D = "#d97706"
AMBER_E = "#78350f"

class VigenereEncodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Vigenère: Cifragem Polialfabética</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Substituição Cíclica no Espaço Modular: <b>c<sub>i</sub> ≡ (m<sub>i</sub> + k<sub>i</sub>) (mod 26)</b>", font_size=19, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(2.0)

        # 2. Apresentação da mensagem clara e palavra-chave
        txt_header = MarkupText("Mensagem Clara: <b>'REDE DE COMPUTADORES SEGURA'</b>", font_size=20, color=BLUE_C).shift(UP * 1.8 + LEFT * 0.5)
        chave_header = MarkupText("Palavra-Chave Periódica: <b>'CHAVE'</b> (Comprimento <i>L</i> = 5)", font_size=19, color=YELLOW_C).next_to(txt_header, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(txt_header), run_time=0.9)
        self.play(FadeIn(chave_header), run_time=0.8)
        self.wait(2.0)

        # 3. Alinhamento Cíclico da Chave (Demonstração da regra de espaços)
        regra_box = RoundedRectangle(corner_radius=0.15, width=10.5, height=1.1, stroke_color=BLUE_D, fill_color=BLUE_E, fill_opacity=0.2).shift(UP * 0.4)
        regra_txt = MarkupText(
            "<b>Regra de Alinhamento:</b> A chave cicla continuamente sobre as letras,\npreservando pontuações e espaços sem consumir caracteres da senha.",
            font_size=17,
            color=WHITE
        ).move_to(regra_box.get_center())

        self.play(Create(regra_box), Write(regra_txt), run_time=1.0)
        self.wait(2.5)

        self.play(FadeOut(regra_box), FadeOut(regra_txt), run_time=0.5)

        # 4. Demonstração Caractere a Caractere com Scanner (Palavra 'REDE')
        # M: R(17) E(4) D(3) E(4)
        # K: C(2)  H(7) A(0) V(21)
        # C: T(19) L(11) D(3) Z(25)
        m_chars = ["R", "E", "D", "E"]
        m_vals  = ["17", "4", "3", "4"]
        k_chars = ["C", "H", "A", "V"]
        k_vals  = ["2", "7", "0", "21"]
        c_chars = ["T", "L", "D", "Z"]
        c_vals  = ["19", "11", "3", "25"]

        start_x = -2.2
        spacing = 1.45

        tag_m = MarkupText("Mensagem <i>M</i>:", font_size=18, color=BLUE_C).move_to([start_x - 1.6, 0.7, 0])
        tag_k = MarkupText("Chave <i>K</i>:", font_size=18, color=YELLOW_C).move_to([start_x - 1.6, -0.15, 0])
        tag_c = MarkupText("Cifrado <i>C</i>:", font_size=18, color=GREEN_C).move_to([start_x - 1.6, -1.05, 0])

        box_m = VGroup()
        box_k = VGroup()
        box_c = VGroup()

        for i in range(4):
            x = start_x + i * spacing
            bm = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=BLUE_E, stroke_width=2.5, fill_color=BLUE_E, fill_opacity=0.25),
                MarkupText(f"<b>{m_chars[i]}</b> <span size='small' foreground='#93c5fd'>({m_vals[i]})</span>", font_size=18, color=BLUE_C)
            ).move_to([x, 0.7, 0])
            box_m.add(bm)

            bk = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=YELLOW_E, stroke_width=2.5, fill_color=YELLOW_E, fill_opacity=0.25),
                MarkupText(f"<b>{k_chars[i]}</b> <span size='small' foreground='#fde047'>({k_vals[i]})</span>", font_size=18, color=YELLOW_C)
            ).move_to([x, -0.15, 0])
            box_k.add(bk)

            bc = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=GREEN_E, stroke_width=2.5, fill_color=GREEN_E, fill_opacity=0.3),
                MarkupText(f"<b>{c_chars[i]}</b> <span size='small' foreground='#86efac'>({c_vals[i]})</span>", font_size=18, color=GREEN_C)
            ).move_to([x, -1.05, 0])
            box_c.add(bc)

        div_line = Line(start=[start_x - 0.7, -0.58, 0], end=[start_x + 3 * spacing + 0.7, -0.58, 0], stroke_width=2.5, stroke_color=GRAY_D)
        soma_symbol = MarkupText("<b>+</b>", font_size=24, color=WHITE).move_to([start_x - 0.7, -0.15, 0])

        self.play(FadeIn(tag_m), FadeIn(box_m), run_time=0.8)
        self.play(FadeIn(tag_k), FadeIn(box_k), FadeIn(soma_symbol), Create(div_line), run_time=0.8)
        self.wait(1.5)

        # Scanner processa cada coluna exibindo a soma modular
        self.play(FadeIn(tag_c), run_time=0.4)
        scanner = Rectangle(width=1.3, height=2.6, stroke_color=WHITE, stroke_width=3, fill_color=WHITE, fill_opacity=0.15)
        scanner.move_to([start_x, -0.15, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(4):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.15, 0]),
                FadeIn(box_c[i]),
                run_time=0.6
            )
            self.wait(0.6)

        self.play(FadeOut(scanner), run_time=0.3)

        # 5. Destaque Pedagógico: Achatamento de Frequência
        insight_box = RoundedRectangle(corner_radius=0.15, width=10.5, height=1.35, stroke_color=EMERALD, fill_color=BLACK, fill_opacity=0.9).shift(DOWN * 2.5)
        insight_l1 = MarkupText("<b>Efeito Polialfabético:</b> A mesma letra <b>'E'</b> foi cifrada como <b>'L'</b> (pos. 2) e como <b>'Z'</b> (pos. 4)", font_size=18, color=WHITE).move_to(insight_box.get_center() + UP * 0.25)
        insight_l2 = MarkupText("Múltiplos alfabetos de César eliminam picos óbvios de frequência unigramática.", font_size=16, color=EMERALD).move_to(insight_box.get_center() + DOWN * 0.25)

        self.play(Create(insight_box), Write(insight_l1), Write(insight_l2), run_time=1.2)
        self.wait(4.0)


class VigenereDecodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Vigenère: Decifragem Modular</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Recuperação com Deslocamento Reverso: <b>m<sub>i</sub> ≡ (c<sub>i</sub> - k<sub>i</sub> + 26) (mod 26)</b>", font_size=19, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(2.0)

        # 2. Apresentação do Criptograma e Chave
        txt_header = MarkupText("Criptograma Recebido: <b>'TLDZ HG JVORWTEQKGU VIMWRA'</b>", font_size=20, color=GREEN_C).shift(UP * 1.8 + LEFT * 0.3)
        chave_header = MarkupText("Chave Compartilhada: <b>'CHAVE'</b> (Deslocamentos conhecidos)", font_size=19, color=YELLOW_C).next_to(txt_header, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(txt_header), run_time=0.9)
        self.play(FadeIn(chave_header), run_time=0.8)
        self.wait(2.0)

        # 3. Destaque da Normalização Modular (+26)
        norm_box = RoundedRectangle(corner_radius=0.15, width=10.5, height=1.1, stroke_color=TEAL_C, fill_color=BLACK, fill_opacity=0.85).shift(UP * 0.4)
        norm_txt = MarkupText(
            "<b>Normalização no Anel ℤ₂₆:</b> Se (<i>c<sub>i</sub> - k<sub>i</sub></i>) for negativo,\nsoma-se <b>+ 26</b> para manter o resíduo congruente positivo no alfabeto.",
            font_size=17,
            color=WHITE
        ).move_to(norm_box.get_center())

        self.play(Create(norm_box), Write(norm_txt), run_time=1.0)
        self.wait(2.5)

        self.play(FadeOut(norm_box), FadeOut(norm_txt), run_time=0.5)

        # 4. Decifragem Caractere a Caractere (Bloco 'TLDZ')
        # C: T(19) L(11) D(3) Z(25)
        # K: C(2)  H(7)  A(0) V(21)
        # M: R(17) E(4)  D(3) E(4)
        c_chars = ["T", "L", "D", "Z"]
        c_vals  = ["19", "11", "3", "25"]
        k_chars = ["C", "H", "A", "V"]
        k_vals  = ["2", "7", "0", "21"]
        m_chars = ["R", "E", "D", "E"]
        m_vals  = ["17", "4", "3", "4"]

        start_x = -2.2
        spacing = 1.45

        tag_c = MarkupText("Cifrado <i>C</i>:", font_size=18, color=GREEN_C).move_to([start_x - 1.6, 0.7, 0])
        tag_k = MarkupText("Chave <i>K</i>:", font_size=18, color=YELLOW_C).move_to([start_x - 1.6, -0.15, 0])
        tag_m = MarkupText("Texto <i>M</i>:", font_size=18, color=BLUE_C).move_to([start_x - 1.6, -1.05, 0])

        box_c = VGroup()
        box_k = VGroup()
        box_m = VGroup()

        for i in range(4):
            x = start_x + i * spacing
            bc = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=GREEN_E, stroke_width=2.5, fill_color=GREEN_E, fill_opacity=0.25),
                MarkupText(f"<b>{c_chars[i]}</b> <span size='small' foreground='#86efac'>({c_vals[i]})</span>", font_size=18, color=GREEN_C)
            ).move_to([x, 0.7, 0])
            box_c.add(bc)

            bk = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=YELLOW_E, stroke_width=2.5, fill_color=YELLOW_E, fill_opacity=0.25),
                MarkupText(f"<b>{k_chars[i]}</b> <span size='small' foreground='#fde047'>({k_vals[i]})</span>", font_size=18, color=YELLOW_C)
            ).move_to([x, -0.15, 0])
            box_k.add(bk)

            bm = VGroup(
                RoundedRectangle(corner_radius=0.1, width=1.15, height=0.68, stroke_color=BLUE_E, stroke_width=2.5, fill_color=BLUE_E, fill_opacity=0.3),
                MarkupText(f"<b>{m_chars[i]}</b> <span size='small' foreground='#93c5fd'>({m_vals[i]})</span>", font_size=18, color=BLUE_C)
            ).move_to([x, -1.05, 0])
            box_m.add(bm)

        div_line = Line(start=[start_x - 0.7, -0.58, 0], end=[start_x + 3 * spacing + 0.7, -0.58, 0], stroke_width=2.5, stroke_color=GRAY_D)
        sub_symbol = MarkupText("<b>-</b>", font_size=28, color=WHITE).move_to([start_x - 0.7, -0.15, 0])

        self.play(FadeIn(tag_c), FadeIn(box_c), run_time=0.8)
        self.play(FadeIn(tag_k), FadeIn(box_k), FadeIn(sub_symbol), Create(div_line), run_time=0.8)
        self.wait(1.5)

        # Scanner subtrai a chave e decodifica a mensagem clara
        self.play(FadeIn(tag_m), run_time=0.4)
        scanner = Rectangle(width=1.3, height=2.6, stroke_color=WHITE, stroke_width=3, fill_color=WHITE, fill_opacity=0.15)
        scanner.move_to([start_x, -0.15, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(4):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.15, 0]),
                FadeIn(box_m[i]),
                run_time=0.6
            )
            self.wait(0.6)

        self.play(FadeOut(scanner), run_time=0.3)

        # 5. Confirmação Final de Decifragem Íntegra
        res_box = RoundedRectangle(corner_radius=0.15, width=10.5, height=1.35, stroke_color=BLUE_C, fill_color=BLACK, fill_opacity=0.9).shift(DOWN * 2.5)
        res_l1 = MarkupText("<b>Mensagem Reconstituída:</b> 'REDE DE COMPUTADORES SEGURA'", font_size=19, color=WHITE).move_to(res_box.get_center() + UP * 0.25)
        res_l2 = MarkupText("<b>✓ Reversibilidade simétrica perfeita comprovada via aritmética em ℤ₂₆</b>", font_size=16, color=BLUE_B).move_to(res_box.get_center() + DOWN * 0.25)

        self.play(Create(res_box), Write(res_l1), Write(res_l2), run_time=1.2)
        self.wait(4.0)


class VigenereKasiskiScene(Scene):
    def construct(self):
        # 1. Título e subtítulo do ataque
        titulo = MarkupText("<b>Criptanálise de Vigenère: O Exame de Kasiski</b>", font_size=28, color=RED_C).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Quebra Estrutural da Periodicidade da Chave (Friedrich Kasiski, 1863)", font_size=19, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(2.0)

        # 2. Fita do Criptograma com Repetições de Trigramas
        # Demonstração: sequências repetidas surgem quando palavras iguais coincidem com a mesma fase da chave
        fita_box = RoundedRectangle(corner_radius=0.12, width=10.8, height=1.0, stroke_color=GRAY_C, fill_color=BLACK, fill_opacity=0.8).shift(UP * 1.8)
        
        fita_markup = MarkupText(
            "C:  ...  <span foreground='#f87171'><b>V P T</b></span>  X  L  M  Q  R  T  B  N  K  O  <span foreground='#f87171'><b>V P T</b></span>  J  W  A  P  C  Z  D  E  <span foreground='#f87171'><b>V P T</b></span>  ...",
            font_size=17,
            color=WHITE
        ).move_to(fita_box.get_center())

        self.play(Create(fita_box), Write(fita_markup), run_time=1.2)
        self.wait(2.0)

        # Explicação da causa da repetição
        causa_txt = MarkupText(
            "O mesmo trigrama claro (ex: <b>'QUE'</b>) alinhou-se com o mesmo trecho da chave (ex: <b>'CHAVE'</b>),\nproduzindo o mesmo bloco cifrado <b>'VPT'</b> em posições espaçadas.",
            font_size=17,
            color=YELLOW_C
        ).shift(UP * 0.75)
        self.play(FadeIn(causa_txt), run_time=0.9)
        self.wait(2.5)

        # 3. Medição de Distâncias entre Ocorrências
        self.play(FadeOut(causa_txt), run_time=0.5)

        dist_box = RoundedRectangle(corner_radius=0.15, width=10.8, height=1.35, stroke_color=AMBER_D, fill_color=AMBER_E, fill_opacity=0.2).shift(DOWN * 0.3)
        dist_lbl1 = MarkupText("Distância entre 1ª e 2ª repetição:  <b>Δ₁ = 15 caracteres</b>", font_size=18, color=WHITE).move_to(dist_box.get_center() + UP * 0.3)
        dist_lbl2 = MarkupText("Distância entre 2ª e 3ª repetição:  <b>Δ₂ = 25 caracteres</b>", font_size=18, color=WHITE).move_to(dist_box.get_center() + DOWN * 0.3)

        self.play(Create(dist_box), Write(dist_lbl1), Write(dist_lbl2), run_time=1.0)
        self.wait(2.5)

        # 4. Cálculo do Máximo Divisor Comum (MDC)
        mdc_box = RoundedRectangle(corner_radius=0.15, width=10.8, height=1.2, stroke_color=RED_D, fill_color=BLACK, fill_opacity=0.9).shift(DOWN * 1.8)
        mdc_conta = MarkupText("O comprimento <i>L</i> da chave divide todas as distâncias:", font_size=17, color=GRAY_B).move_to(mdc_box.get_center() + UP * 0.28)
        mdc_res = MarkupText("<b>Comprimento Revelado:  <i>L</i> = mdc(Δ₁, Δ₂) = mdc(15, 25) = <span foreground='#34d399'>5</span></b>", font_size=20, color=WHITE).move_to(mdc_box.get_center() + DOWN * 0.28)

        self.play(Create(mdc_box), Write(mdc_conta), Write(mdc_res), run_time=1.2)
        self.wait(3.0)

        # 5. Redução Estrutural a Cifras de César
        self.play(
            FadeOut(fita_box),
            FadeOut(fita_markup),
            FadeOut(dist_box),
            FadeOut(dist_lbl1),
            FadeOut(dist_lbl2),
            FadeOut(mdc_box),
            FadeOut(mdc_conta),
            FadeOut(mdc_res),
            run_time=0.6
        )

        red_box = RoundedRectangle(corner_radius=0.15, width=10.8, height=2.2, stroke_color=EMERALD, fill_color=BLACK, fill_opacity=0.9).shift(DOWN * 0.3)
        red_title = MarkupText("<b>Redução Criptanalítica de Vigenère a <i>L</i> Cifras Monoalfabéticas:</b>", font_size=19, color=EMERALD).move_to(red_box.get_center() + UP * 0.65)
        red_desc1 = MarkupText("Com <i>L</i> = 5, o texto é fatiado em <b>5 fluxos independentes</b> (cada fluxo cifrado por uma letra fixa).", font_size=17, color=WHITE).move_to(red_box.get_center() + UP * 0.1)
        red_desc2 = MarkupText("Cada fluxo é decifrado instantaneamente pela análise clássica de frequências de César.", font_size=17, color=WHITE).move_to(red_box.get_center() + DOWN * 0.4)

        self.play(Create(red_box), Write(red_title), Write(red_desc1), Write(red_desc2), run_time=1.2)
        self.wait(4.0)
