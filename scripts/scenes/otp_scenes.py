"""
otp_scenes.py - Cenas Manim para demonstração didática do One-Time Pad (OTP).
Contém:
1. OtpStepByStepScene: Cifragem e decifragem passo a passo (decimal <-> binário <-> XOR).
2. OtpTwoTimePadScene: Demonstração da quebra de segurança por reutilização de chave (Two-Time Pad).
"""

from manim import *

class OtpStepByStepScene(Scene):
    def construct(self):
        # 1. Título e cabeçalho
        titulo = MarkupText("<b>One-Time Pad: Cifragem e Decifragem</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.4)
        subtitulo = MarkupText("Fluxo: Decimal → Bits → XOR (⊕) → Decimal", font_size=18, color=GRAY).next_to(titulo, DOWN, buff=0.15)

        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(0.8)

        # 2. Apresentação dos dados decimais
        m_dec_label = MarkupText("Mensagem Clara <i>M</i>: <b>42</b>", font_size=22, color=BLUE_C).shift(UP * 1.5 + LEFT * 3)
        k_dec_label = MarkupText("Chave Aleatória <i>K</i>: <b>27</b>", font_size=22, color=YELLOW_C).shift(UP * 0.7 + LEFT * 3)

        self.play(Write(m_dec_label), Write(k_dec_label), run_time=1.0)
        self.wait(0.8)

        # 3. Conversão para binário (8 bits)
        bits_m_str = ["0", "0", "1", "0", "1", "0", "1", "0"]
        bits_k_str = ["0", "0", "0", "1", "1", "0", "1", "1"]
        bits_c_str = ["0", "0", "1", "1", "0", "0", "0", "1"]

        lbl_bin_m = MarkupText("<i>M</i> (base 2):", font_size=18, color=BLUE_C).shift(UP * 0.5 + LEFT * 3.8)
        lbl_bin_k = MarkupText("<i>K</i> (base 2):", font_size=18, color=YELLOW_C).shift(DOWN * 0.2 + LEFT * 3.8)
        lbl_bin_c = MarkupText("<i>C = M ⊕ K</i>:", font_size=18, color=GREEN_C).shift(DOWN * 1.0 + LEFT * 3.8)

        box_m_group = VGroup()
        box_k_group = VGroup()
        box_c_group = VGroup()

        start_x = -1.2
        spacing = 0.65

        for i in range(8):
            x = start_x + i * spacing
            bm = VGroup(
                Square(side_length=0.55, stroke_color=BLUE_E, stroke_width=2, fill_color=BLUE_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_m_str[i]}</b>", font_size=20, color=BLUE_C)
            ).move_to([x, 0.5, 0])
            box_m_group.add(bm)

            bk = VGroup(
                Square(side_length=0.55, stroke_color=YELLOW_E, stroke_width=2, fill_color=YELLOW_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_k_str[i]}</b>", font_size=20, color=YELLOW_C)
            ).move_to([x, -0.2, 0])
            box_k_group.add(bk)

            bc = VGroup(
                Square(side_length=0.55, stroke_color=GREEN_E, stroke_width=2, fill_color=GREEN_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_c_str[i]}</b>", font_size=20, color=GREEN_C)
            ).move_to([x, -1.0, 0])
            box_c_group.add(bc)

        div_line = Line(start=[start_x - 0.4, -0.58, 0], end=[start_x + 7 * spacing + 0.4, -0.58, 0], stroke_width=2, stroke_color=GRAY_D)

        self.play(FadeIn(lbl_bin_m), FadeIn(box_m_group), run_time=1.0)
        self.play(FadeIn(lbl_bin_k), FadeIn(box_k_group), Create(div_line), run_time=1.0)
        self.wait(1.0)

        # 4. Scanner de cálculo XOR bit a bit
        self.play(FadeIn(lbl_bin_c), run_time=0.5)

        scanner = Rectangle(width=0.6, height=2.2, stroke_color=WHITE, stroke_width=3, fill_color=WHITE, fill_opacity=0.15)
        scanner.move_to([start_x, -0.25, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.25, 0]),
                FadeIn(box_c_group[i]),
                run_time=0.35
            )

        self.play(FadeOut(scanner), run_time=0.4)
        self.wait(0.8)

        # 5. Reconversão para decimal e simetria reversa
        res_dec = MarkupText("Criptograma <i>C</i>: <b>00110001₂ = 49₁₀</b>", font_size=22, color=GREEN_B).shift(DOWN * 2.0)
        reversao = MarkupText("Decriptação: <b>49 ⊕ 27 = 42</b> (Recuperação Exata)", font_size=18, color=TEAL_C).next_to(res_dec, DOWN, buff=0.2)

        self.play(Write(res_dec), run_time=1.0)
        self.play(FadeIn(reversao), run_time=0.8)
        self.wait(3.0)


class OtpTwoTimePadScene(Scene):
    def construct(self):
        # 1. Título de alerta
        titulo = MarkupText("<b>Catástrofe Criptográfica: Two-Time Pad</b>", font_size=28, color=RED_C).to_edge(UP, buff=0.4)
        subtitulo = MarkupText("O que acontece quando a mesma chave <i>K</i> é reutilizada?", font_size=18, color=GRAY).next_to(titulo, DOWN, buff=0.15)

        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(1.0)

        # 2. Dois textos cifrados com a mesma chave
        eq1 = MarkupText("Criptograma 1:  <i>C</i>₁ = <i>M</i>₁ ⊕ <span foreground='#f59e0b'><b>K</b></span>", font_size=24, color=WHITE).shift(UP * 1.3)
        eq2 = MarkupText("Criptograma 2:  <i>C</i>₂ = <i>M</i>₂ ⊕ <span foreground='#f59e0b'><b>K</b></span>", font_size=24, color=WHITE).shift(UP * 0.5)

        self.play(Write(eq1), Write(eq2), run_time=1.2)
        self.wait(1.0)

        # 3. Ataque: XOR entre os dois criptogramas
        ataque_label = MarkupText("O adversário intercepta ambos e calcula <i>C</i>₁ ⊕ <i>C</i>₂:", font_size=19, color=YELLOW_C).shift(DOWN * 0.3)
        self.play(FadeIn(ataque_label), run_time=0.8)
        self.wait(0.8)

        deducao1 = MarkupText("<i>C</i>₁ ⊕ <i>C</i>₂ = (<i>M</i>₁ ⊕ <span foreground='#f59e0b'><b>K</b></span>) ⊕ (<i>M</i>₂ ⊕ <span foreground='#f59e0b'><b>K</b></span>)", font_size=22, color=WHITE).shift(DOWN * 1.0)
        self.play(Write(deducao1), run_time=1.2)
        self.wait(1.0)

        # 4. Cancelamento da chave K: K (+) K = 0
        cancelamento = MarkupText("Como <span foreground='#f59e0b'><b>K ⊕ K = 0</b></span> (auto-inverso aditivo):", font_size=19, color=ORANGE).shift(DOWN * 1.7)
        resultado_final = MarkupText("<b><i>C</i>₁ ⊕ <i>C</i>₂ = <i>M</i>₁ ⊕ <i>M</i>₂</b>", font_size=28, color=RED_B).shift(DOWN * 2.4)

        box_alerta = SurroundingRectangle(resultado_final, color=RED, buff=0.2, stroke_width=2.5)

        self.play(FadeIn(cancelamento), run_time=0.8)
        self.play(Write(resultado_final), Create(box_alerta), run_time=1.2)
        self.wait(1.0)

        # 5. Conclusão pedagógica
        conclusao = MarkupText("A chave <i>K</i> desaparece! As duas mensagens ficam expostas.", font_size=18, color=WHITE).next_to(box_alerta, DOWN, buff=0.3)
        self.play(FadeIn(conclusao), run_time=0.8)
        self.wait(3.0)
