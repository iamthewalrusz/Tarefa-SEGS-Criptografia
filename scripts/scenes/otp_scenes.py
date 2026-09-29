"""
otp_scenes.py - Cenas Manim para demonstração didática do One-Time Pad (OTP).
Contém:
1. OtpStepByStepScene: Cifragem e Decifragem passo a passo (fontes ampliadas, layout limpo).
2. OtpTwoTimePadScene: Ataque prático Two-Time Pad com scanner bit a bit evidenciando o cancelamento K ⊕ K = 0.
"""

from manim import *

EMERALD = "#10b981"
AMBER_D = "#d97706"
AMBER_E = "#78350f"

class OtpStepByStepScene(Scene):
    def construct(self):
        # 1. Título principal e subtítulo com fontes ampliadas
        titulo = MarkupText("<b>One-Time Pad: Cifragem e Decifragem Completa</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.35)
        self.play(FadeIn(titulo), run_time=0.7)

        # -------------------------------------------------------------
        # FASE 1: CIFRAGEM (M ⊕ K = C)
        # -------------------------------------------------------------
        fase1_banner = MarkupText("<span foreground='#38bdf8'><b>FASE 1: CIFRAGEM (M ⊕ K = C)</b></span>", font_size=21).next_to(titulo, DOWN, buff=0.2)
        self.play(FadeIn(fase1_banner), run_time=0.6)
        self.wait(1.2)

        # Valores decimais bem posicionados no topo
        m_label = MarkupText("Mensagem Clara: <i>M</i> = <b>42</b> (base 10)", font_size=21, color=BLUE_C).shift(UP * 1.8 + LEFT * 2.5)
        k_label = MarkupText("Chave Aleatória: <i>K</i> = <b>27</b> (base 10)", font_size=21, color=YELLOW_C).shift(UP * 1.25 + LEFT * 2.5)

        self.play(Write(m_label), Write(k_label), run_time=0.9)
        self.wait(1.2)

        # Configuração das caixas de bits ampliadas
        bits_m = ["0", "0", "1", "0", "1", "0", "1", "0"]  # 42
        bits_k = ["0", "0", "0", "1", "1", "0", "1", "1"]  # 27
        bits_c = ["0", "0", "1", "1", "0", "0", "0", "1"]  # 49

        start_x = -2.5
        spacing = 0.72

        tag_m = MarkupText("<i>M</i> (bits):", font_size=18, color=BLUE_C).move_to([start_x - 1.25, 0.45, 0])
        tag_k = MarkupText("<i>K</i> (bits):", font_size=18, color=YELLOW_C).move_to([start_x - 1.25, -0.3, 0])
        tag_c = MarkupText("<i>C</i> (bits):", font_size=18, color=GREEN_C).move_to([start_x - 1.25, -1.15, 0])

        box_m = VGroup()
        box_k = VGroup()
        box_c = VGroup()

        for i in range(8):
            x = start_x + i * spacing
            bm = VGroup(
                Square(side_length=0.58, stroke_color=BLUE_E, stroke_width=2.5, fill_color=BLUE_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_m[i]}</b>", font_size=22, color=BLUE_C)
            ).move_to([x, 0.45, 0])
            box_m.add(bm)

            bk = VGroup(
                Square(side_length=0.58, stroke_color=YELLOW_E, stroke_width=2.5, fill_color=YELLOW_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_k[i]}</b>", font_size=22, color=YELLOW_C)
            ).move_to([x, -0.3, 0])
            box_k.add(bk)

            bc = VGroup(
                Square(side_length=0.58, stroke_color=GREEN_E, stroke_width=2.5, fill_color=GREEN_E, fill_opacity=0.3),
                MarkupText(f"<b>{bits_c[i]}</b>", font_size=22, color=GREEN_C)
            ).move_to([x, -1.15, 0])
            box_c.add(bc)

        div_line = Line(start=[start_x - 0.45, -0.72, 0], end=[start_x + 7 * spacing + 0.45, -0.72, 0], stroke_width=2.5, stroke_color=GRAY_D)
        xor_symbol = MarkupText("<b>⊕</b>", font_size=24, color=WHITE).move_to([start_x - 0.55, -0.3, 0])

        self.play(FadeIn(tag_m), FadeIn(box_m), run_time=0.8)
        self.play(FadeIn(tag_k), FadeIn(box_k), FadeIn(xor_symbol), Create(div_line), run_time=0.8)
        self.wait(1.2)

        # Scanner percorre da esquerda para a direita calculando o XOR
        self.play(FadeIn(tag_c), run_time=0.4)
        scanner = Rectangle(width=0.66, height=2.4, stroke_color=WHITE, stroke_width=3, fill_color=WHITE, fill_opacity=0.18)
        scanner.move_to([start_x, -0.35, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.35, 0]),
                FadeIn(box_c[i]),
                run_time=0.32
            )

        self.play(FadeOut(scanner), run_time=0.3)

        c_dec_result = MarkupText("Criptograma Gerado <i>C</i>: <b>00110001₂ = 49₁₀</b>", font_size=22, color=GREEN_B).shift(DOWN * 2.0)
        self.play(Write(c_dec_result), run_time=0.8)
        self.wait(2.5)

        # -------------------------------------------------------------
        # FASE 2: DECIFRAGEM VISUAL (C ⊕ K = M)
        # -------------------------------------------------------------
        self.play(
            FadeOut(fase1_banner),
            FadeOut(m_label),
            FadeOut(k_label),
            FadeOut(box_m),
            FadeOut(tag_m),
            FadeOut(box_k),
            FadeOut(tag_k),
            FadeOut(box_c),
            FadeOut(tag_c),
            FadeOut(xor_symbol),
            FadeOut(div_line),
            FadeOut(c_dec_result),
            run_time=0.8
        )

        fase2_banner = MarkupText("<span foreground='#34d399'><b>FASE 2: DECIFRAGEM SIMÉTRICA (C ⊕ K = M)</b></span>", font_size=21).next_to(titulo, DOWN, buff=0.2)
        self.play(FadeIn(fase2_banner), run_time=0.6)
        self.wait(1.2)

        c_dec_top = MarkupText("Criptograma Recebido: <i>C</i> = <b>49</b> (base 10)", font_size=21, color=GREEN_C).shift(UP * 1.8 + LEFT * 2.5)
        k_dec_top = MarkupText("Mesma Chave Compartilhada: <i>K</i> = <b>27</b> (base 10)", font_size=21, color=YELLOW_C).shift(UP * 1.25 + LEFT * 2.5)
        self.play(Write(c_dec_top), Write(k_dec_top), run_time=0.9)
        self.wait(1.2)

        tag_c2 = MarkupText("<i>C</i> (bits):", font_size=18, color=GREEN_C).move_to([start_x - 1.25, 0.45, 0])
        tag_k2 = MarkupText("<i>K</i> (bits):", font_size=18, color=YELLOW_C).move_to([start_x - 1.25, -0.3, 0])
        tag_m2 = MarkupText("<i>M</i> (recup):", font_size=18, color=BLUE_C).move_to([start_x - 1.25, -1.15, 0])

        box_c2 = VGroup()
        box_k2 = VGroup()
        box_m_rec = VGroup()

        for i in range(8):
            x = start_x + i * spacing
            bc2 = VGroup(
                Square(side_length=0.58, stroke_color=GREEN_E, stroke_width=2.5, fill_color=GREEN_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_c[i]}</b>", font_size=22, color=GREEN_C)
            ).move_to([x, 0.45, 0])
            box_c2.add(bc2)

            bk2 = VGroup(
                Square(side_length=0.58, stroke_color=YELLOW_E, stroke_width=2.5, fill_color=YELLOW_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_k[i]}</b>", font_size=22, color=YELLOW_C)
            ).move_to([x, -0.3, 0])
            box_k2.add(bk2)

            bm2 = VGroup(
                Square(side_length=0.58, stroke_color=BLUE_E, stroke_width=2.5, fill_color=BLUE_E, fill_opacity=0.3),
                MarkupText(f"<b>{bits_m[i]}</b>", font_size=22, color=BLUE_C)
            ).move_to([x, -1.15, 0])
            box_m_rec.add(bm2)

        self.play(FadeIn(tag_c2), FadeIn(box_c2), run_time=0.8)
        self.play(FadeIn(tag_k2), FadeIn(box_k2), FadeIn(xor_symbol), Create(div_line), run_time=0.8)
        self.wait(1.2)

        # Scanner decifrando C ⊕ K
        self.play(FadeIn(tag_m2), run_time=0.4)
        scanner.move_to([start_x, -0.35, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.35, 0]),
                FadeIn(box_m_rec[i]),
                run_time=0.32
            )

        self.play(FadeOut(scanner), run_time=0.3)

        res_final = MarkupText("Mensagem Decifrada: <b>00101010₂ = 42₁₀</b>", font_size=23, color=BLUE_B).shift(DOWN * 2.0)
        confirmacao = MarkupText("<b>✓ Decifragem exata: M recuperada perfeitamente!</b>", font_size=19, color=EMERALD).next_to(res_final, DOWN, buff=0.22)

        self.play(Write(res_final), run_time=0.8)
        self.play(FadeIn(confirmacao), run_time=0.8)
        self.wait(3.5)


class OtpTwoTimePadScene(Scene):
    def construct(self):
        # 1. Título do ataque e subtítulo com fontes ampliadas
        titulo = MarkupText("<b>Ataque Two-Time Pad: Reutilização da Chave</b>", font_size=28, color=RED_C).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Cancelamento Algébrico da Chave: <b>C₁ ⊕ C₂ = M₁ ⊕ M₂</b>", font_size=19, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(1.5)

        # 2. Interceptação prática dos fluxos na rede
        # M1 = 42 (00101010), K = 27 (00011011) -> C1 = 49 (00110001)
        # M2 = 85 (01010101), K = 27 (00011011) -> C2 = 78 (01001110)
        canal1_box = RoundedRectangle(corner_radius=0.15, width=10.2, height=0.95, stroke_color=BLUE_D, fill_color=BLUE_E, fill_opacity=0.2).shift(UP * 1.8)
        canal2_box = RoundedRectangle(corner_radius=0.15, width=10.2, height=0.95, stroke_color=AMBER_D, fill_color=AMBER_E, fill_opacity=0.2).shift(UP * 0.75)

        c1_stream_text = MarkupText("Canal 1: <i>C</i>₁ = <i>M</i>₁ ⊕ <span foreground='#fbbf24'><b>K</b></span> = <b>00110001₂</b> (49₁₀)", font_size=19, color=WHITE).move_to(canal1_box.get_center())
        c2_stream_text = MarkupText("Canal 2: <i>C</i>₂ = <i>M</i>₂ ⊕ <span foreground='#fbbf24'><b>K</b></span> = <b>01001110₂</b> (78₁₀)", font_size=19, color=WHITE).move_to(canal2_box.get_center())

        self.play(Create(canal1_box), Write(c1_stream_text), run_time=0.9)
        self.play(Create(canal2_box), Write(c2_stream_text), run_time=0.9)
        self.wait(1.5)

        # Limpar canais para dar espaço à demonstração bit a bit
        self.play(
            FadeOut(canal1_box),
            FadeOut(c1_stream_text),
            FadeOut(canal2_box),
            FadeOut(c2_stream_text),
            run_time=0.6
        )

        # 3. Operação Bit a Bit do Adversário
        adv_header = MarkupText("<b>Cálculo Bit a Bit do Adversário: C₁ ⊕ C₂</b>", font_size=20, color=RED_C).shift(UP * 2.0)
        self.play(FadeIn(adv_header), run_time=0.6)

        bits_c1 = ["0", "0", "1", "1", "0", "0", "0", "1"]  # 49
        bits_c2 = ["0", "1", "0", "0", "1", "1", "1", "0"]  # 78
        bits_res = ["0", "1", "1", "1", "1", "1", "1", "1"]  # M1 ⊕ M2 = 127

        start_x = -2.5
        spacing = 0.72

        tag_c1 = MarkupText("<i>C</i>₁ (bits):", font_size=18, color=BLUE_C).move_to([start_x - 1.25, 0.9, 0])
        tag_c2 = MarkupText("<i>C</i>₂ (bits):", font_size=18, color=AMBER_D).move_to([start_x - 1.25, 0.15, 0])
        tag_res = MarkupText("<i>M</i>₁⊕<i>M</i>₂:", font_size=18, color=RED_B).move_to([start_x - 1.25, -0.7, 0])

        box_c1 = VGroup()
        box_c2 = VGroup()
        box_res = VGroup()

        for i in range(8):
            x = start_x + i * spacing
            b1 = VGroup(
                Square(side_length=0.58, stroke_color=BLUE_E, stroke_width=2.5, fill_color=BLUE_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_c1[i]}</b>", font_size=22, color=BLUE_C)
            ).move_to([x, 0.9, 0])
            box_c1.add(b1)

            b2 = VGroup(
                Square(side_length=0.58, stroke_color=AMBER_E, stroke_width=2.5, fill_color=AMBER_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_c2[i]}</b>", font_size=22, color=AMBER_D)
            ).move_to([x, 0.15, 0])
            box_c2.add(b2)

            br = VGroup(
                Square(side_length=0.58, stroke_color=RED_E, stroke_width=2.5, fill_color=RED_E, fill_opacity=0.3),
                MarkupText(f"<b>{bits_res[i]}</b>", font_size=22, color=RED_B)
            ).move_to([x, -0.7, 0])
            box_res.add(br)

        div_line = Line(start=[start_x - 0.45, -0.27, 0], end=[start_x + 7 * spacing + 0.45, -0.27, 0], stroke_width=2.5, stroke_color=GRAY_D)
        xor_symbol = MarkupText("<b>⊕</b>", font_size=24, color=WHITE).move_to([start_x - 0.55, 0.15, 0])

        self.play(FadeIn(tag_c1), FadeIn(box_c1), run_time=0.7)
        self.play(FadeIn(tag_c2), FadeIn(box_c2), FadeIn(xor_symbol), Create(div_line), run_time=0.7)
        self.wait(1.0)

        # 4. Scanner Bit a Bit destacando a anulação algébrica (K_i ⊕ K_i = 0)
        self.play(FadeIn(tag_res), run_time=0.4)

        cancel_detail = MarkupText(
            "(<i>M</i>₁ ⊕ <span foreground='#fbbf24'><b>K</b></span>) ⊕ (<i>M</i>₂ ⊕ <span foreground='#fbbf24'><b>K</b></span>)  →  <span foreground='#fbbf24'><b>K ⊕ K = 0</b></span>  →  <i>M</i>₁ ⊕ <i>M</i>₂",
            font_size=18,
            color=YELLOW_C
        ).shift(DOWN * 1.55)
        self.play(FadeIn(cancel_detail), run_time=0.7)

        scanner = Rectangle(width=0.66, height=2.4, stroke_color=RED_C, stroke_width=3, fill_color=RED_C, fill_opacity=0.18)
        scanner.move_to([start_x, 0.1, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, 0.1, 0]),
                FadeIn(box_res[i]),
                run_time=0.35
            )

        self.play(FadeOut(scanner), run_time=0.3)
        self.wait(1.2)

        # 5. Conclusão prática do ataque
        res_box = RoundedRectangle(corner_radius=0.15, width=10.5, height=1.35, stroke_color=EMERALD, fill_color=BLACK, fill_opacity=0.9).shift(DOWN * 2.7)
        res_texto_l1 = MarkupText("<b>Resultado: <i>C</i>₁ ⊕ <i>C</i>₂ = <i>M</i>₁ ⊕ <i>M</i>₂ = 01111111₂ (127₁₀)</b>", font_size=19, color=WHITE).move_to(res_box.get_center() + UP * 0.28)
        res_texto_l2 = MarkupText("Se o adversário conhece <i>M</i>₁ = <b>42₁₀</b> → <i>M</i>₂ = 127 ⊕ 42 = <b>85₁₀</b> revelado sem a chave!", font_size=17, color=EMERALD).move_to(res_box.get_center() + DOWN * 0.28)

        self.play(Create(res_box), Write(res_texto_l1), Write(res_texto_l2), run_time=1.2)
        self.wait(4.0)
