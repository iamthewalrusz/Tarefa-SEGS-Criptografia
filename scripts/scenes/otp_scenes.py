"""
otp_scenes.py - Cenas Manim para demonstração didática do One-Time Pad (OTP).
Contém:
1. OtpStepByStepScene: Cifragem E Decifragem completa demonstrada passo a passo (sem sobreposições).
2. OtpTwoTimePadScene: Demonstração prática do ataque Two-Time Pad mostrando o cancelamento da chave e decifração real.
"""

from manim import *

EMERALD = "#10b981"
AMBER_D = "#d97706"
AMBER_E = "#78350f"

class OtpStepByStepScene(Scene):
    def construct(self):
        # 1. Título principal
        titulo = MarkupText("<b>One-Time Pad: Cifragem e Decifragem Completa</b>", font_size=26, color=WHITE).to_edge(UP, buff=0.35)
        self.play(FadeIn(titulo), run_time=0.7)

        # -------------------------------------------------------------
        # FASE 1: CIFRAGEM (M ⊕ K = C)
        # -------------------------------------------------------------
        fase1_banner = MarkupText("<span foreground='#38bdf8'><b>FASE 1: CIFRAGEM (M ⊕ K = C)</b></span>", font_size=19).next_to(titulo, DOWN, buff=0.2)
        self.play(FadeIn(fase1_banner), run_time=0.6)
        self.wait(1.0)

        # Valores decimais bem posicionados no topo
        m_label = MarkupText("Mensagem Clara <i>M</i> = <b>42</b> (base 10)", font_size=19, color=BLUE_C).shift(UP * 1.5 + LEFT * 2.8)
        k_label = MarkupText("Chave Aleatória <i>K</i> = <b>27</b> (base 10)", font_size=19, color=YELLOW_C).shift(UP * 1.0 + LEFT * 2.8)

        self.play(Write(m_label), Write(k_label), run_time=0.9)
        self.wait(1.0)

        # Configuração das caixas de bits
        bits_m = ["0", "0", "1", "0", "1", "0", "1", "0"]  # 42
        bits_k = ["0", "0", "0", "1", "1", "0", "1", "1"]  # 27
        bits_c = ["0", "0", "1", "1", "0", "0", "0", "1"]  # 49

        start_x = -1.0
        spacing = 0.65

        tag_m = MarkupText("<i>M</i> (bits):", font_size=16, color=BLUE_C).move_to([start_x - 1.2, 0.2, 0])
        tag_k = MarkupText("<i>K</i> (bits):", font_size=16, color=YELLOW_C).move_to([start_x - 1.2, -0.45, 0])
        tag_c = MarkupText("<i>C</i> (bits):", font_size=16, color=GREEN_C).move_to([start_x - 1.2, -1.2, 0])

        box_m = VGroup()
        box_k = VGroup()
        box_c = VGroup()

        for i in range(8):
            x = start_x + i * spacing
            bm = VGroup(
                Square(side_length=0.52, stroke_color=BLUE_E, stroke_width=2, fill_color=BLUE_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_m[i]}</b>", font_size=19, color=BLUE_C)
            ).move_to([x, 0.2, 0])
            box_m.add(bm)

            bk = VGroup(
                Square(side_length=0.52, stroke_color=YELLOW_E, stroke_width=2, fill_color=YELLOW_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_k[i]}</b>", font_size=19, color=YELLOW_C)
            ).move_to([x, -0.45, 0])
            box_k.add(bk)

            bc = VGroup(
                Square(side_length=0.52, stroke_color=GREEN_E, stroke_width=2, fill_color=GREEN_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_c[i]}</b>", font_size=19, color=GREEN_C)
            ).move_to([x, -1.2, 0])
            box_c.add(bc)

        div_line = Line(start=[start_x - 0.4, -0.82, 0], end=[start_x + 7 * spacing + 0.4, -0.82, 0], stroke_width=2, stroke_color=GRAY_D)
        xor_symbol = MarkupText("<b>⊕</b>", font_size=20, color=WHITE).move_to([start_x - 0.5, -0.45, 0])

        self.play(FadeIn(tag_m), FadeIn(box_m), run_time=0.8)
        self.play(FadeIn(tag_k), FadeIn(box_k), FadeIn(xor_symbol), Create(div_line), run_time=0.8)
        self.wait(1.0)

        # Scanner percorre da esquerda para a direita calculando o XOR
        self.play(FadeIn(tag_c), run_time=0.4)
        scanner = Rectangle(width=0.6, height=2.1, stroke_color=WHITE, stroke_width=3, fill_color=WHITE, fill_opacity=0.15)
        scanner.move_to([start_x, -0.5, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.5, 0]),
                FadeIn(box_c[i]),
                run_time=0.28
            )

        self.play(FadeOut(scanner), run_time=0.3)

        c_dec_result = MarkupText("Texto Cifrado <i>C</i>: <b>00110001₂ = 49₁₀</b>", font_size=20, color=GREEN_B).shift(DOWN * 2.0)
        self.play(Write(c_dec_result), run_time=0.8)
        self.wait(2.0)

        # -------------------------------------------------------------
        # FASE 2: DECIFRAGEM VISUAL (C ⊕ K = M)
        # -------------------------------------------------------------
        # Limpar tela suavemente mantendo cabeçalho
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

        fase2_banner = MarkupText("<span foreground='#34d399'><b>FASE 2: DECIFRAGEM SIMÉTRICA (C ⊕ K = M)</b></span>", font_size=19).next_to(titulo, DOWN, buff=0.2)
        self.play(FadeIn(fase2_banner), run_time=0.6)
        self.wait(1.0)

        c_dec_top = MarkupText("Criptograma <i>C</i> = <b>49</b> (base 10)", font_size=19, color=GREEN_C).shift(UP * 1.5 + LEFT * 2.8)
        k_dec_top = MarkupText("Mesma Chave <i>K</i> = <b>27</b> (base 10)", font_size=19, color=YELLOW_C).shift(UP * 1.0 + LEFT * 2.8)
        self.play(Write(c_dec_top), Write(k_dec_top), run_time=0.9)
        self.wait(1.0)

        tag_c2 = MarkupText("<i>C</i> (bits):", font_size=16, color=GREEN_C).move_to([start_x - 1.2, 0.2, 0])
        tag_k2 = MarkupText("<i>K</i> (bits):", font_size=16, color=YELLOW_C).move_to([start_x - 1.2, -0.45, 0])
        tag_m2 = MarkupText("<i>M</i> (recup):", font_size=16, color=BLUE_C).move_to([start_x - 1.2, -1.2, 0])

        box_c2 = VGroup()
        box_k2 = VGroup()
        box_m_rec = VGroup()

        for i in range(8):
            x = start_x + i * spacing
            bc2 = VGroup(
                Square(side_length=0.52, stroke_color=GREEN_E, stroke_width=2, fill_color=GREEN_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_c[i]}</b>", font_size=19, color=GREEN_C)
            ).move_to([x, 0.2, 0])
            box_c2.add(bc2)

            bk2 = VGroup(
                Square(side_length=0.52, stroke_color=YELLOW_E, stroke_width=2, fill_color=YELLOW_E, fill_opacity=0.2),
                MarkupText(f"<b>{bits_k[i]}</b>", font_size=19, color=YELLOW_C)
            ).move_to([x, -0.45, 0])
            box_k2.add(bk2)

            bm2 = VGroup(
                Square(side_length=0.52, stroke_color=BLUE_E, stroke_width=2, fill_color=BLUE_E, fill_opacity=0.25),
                MarkupText(f"<b>{bits_m[i]}</b>", font_size=19, color=BLUE_C)
            ).move_to([x, -1.2, 0])
            box_m_rec.add(bm2)

        self.play(FadeIn(tag_c2), FadeIn(box_c2), run_time=0.8)
        self.play(FadeIn(tag_k2), FadeIn(box_k2), FadeIn(xor_symbol), Create(div_line), run_time=0.8)
        self.wait(1.0)

        # Scanner decifrando C ⊕ K
        self.play(FadeIn(tag_m2), run_time=0.4)
        scanner.move_to([start_x, -0.5, 0])
        self.play(FadeIn(scanner), run_time=0.3)

        for i in range(8):
            target_x = start_x + i * spacing
            self.play(
                scanner.animate.move_to([target_x, -0.5, 0]),
                FadeIn(box_m_rec[i]),
                run_time=0.28
            )

        self.play(FadeOut(scanner), run_time=0.3)

        res_final = MarkupText("Mensagem Recuperada: <b>00101010₂ = 42₁₀</b>", font_size=21, color=BLUE_B).shift(DOWN * 2.0)
        confirmacao = MarkupText("<b>✓ O resultado bate exatamente com a mensagem original!</b>", font_size=18, color=EMERALD).next_to(res_final, DOWN, buff=0.2)

        self.play(Write(res_final), run_time=0.8)
        self.play(FadeIn(confirmacao), run_time=0.8)
        self.wait(3.0)


class OtpTwoTimePadScene(Scene):
    def construct(self):
        # 1. Título do ataque
        titulo = MarkupText("<b>Ataque Prático: Reutilização de Chave (Two-Time Pad)</b>", font_size=25, color=RED_C).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Dois canais interceptados cifrados com a MESMA chave <i>K</i>", font_size=17, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(1.2)

        # 2. Interceptação prática dos fluxos
        # Canal 1 e Canal 2
        canal1_box = RoundedRectangle(corner_radius=0.15, width=9.5, height=1.0, stroke_color=BLUE_D, fill_color=BLUE_E, fill_opacity=0.15).shift(UP * 1.3)
        canal2_box = RoundedRectangle(corner_radius=0.15, width=9.5, height=1.0, stroke_color=AMBER_D, fill_color=AMBER_E, fill_opacity=0.15).shift(UP * 0.1)

        c1_stream_text = MarkupText("Canal 1: <i>C</i>₁ = <i>M</i>₁ ⊕ <span foreground='#fbbf24'><b>K</b></span> = [ <b>D7</b>  <b>3A</b>  <b>9F</b> ]  (Criptograma 1)", font_size=18, color=WHITE).move_to(canal1_box.get_center())
        c2_stream_text = MarkupText("Canal 2: <i>C</i>₂ = <i>M</i>₂ ⊕ <span foreground='#fbbf24'><b>K</b></span> = [ <b>85</b>  <b>28</b>  <b>F4</b> ]  (Criptograma 2)", font_size=18, color=WHITE).move_to(canal2_box.get_center())

        self.play(Create(canal1_box), Write(c1_stream_text), run_time=1.0)
        self.play(Create(canal2_box), Write(c2_stream_text), run_time=1.0)
        self.wait(1.5)

        # 3. O Adversário calcula C₁ ⊕ C₂ em tempo real
        adv_box = RoundedRectangle(corner_radius=0.15, width=9.5, height=1.2, stroke_color=RED_D, fill_color=RED_E, fill_opacity=0.2).shift(DOWN * 1.3)
        adv_label = MarkupText("<b>Cálculo do Adversário:</b> <i>C</i>₁ ⊕ <i>C</i>₂", font_size=17, color=RED_C).shift(DOWN * 0.95 + LEFT * 2.8)

        xor_conta = MarkupText("(<i>M</i>₁ ⊕ <span foreground='#fbbf24'><b>K</b></span>) ⊕ (<i>M</i>₂ ⊕ <span foreground='#fbbf24'><b>K</b></span>)", font_size=20, color=WHITE).shift(DOWN * 1.4 + LEFT * 1.5)

        self.play(Create(adv_box), FadeIn(adv_label), Write(xor_conta), run_time=1.0)
        self.wait(1.2)

        # 4. As chaves K colidem e se anulam
        k_anula = MarkupText("Como <span foreground='#fbbf24'><b>K ⊕ K = 0</b></span> → A chave desaparece!", font_size=19, color=ORANGE).shift(DOWN * 1.4 + LEFT * 0.8)
        self.play(Transform(xor_conta, k_anula), run_time=1.0)
        self.wait(1.2)

        # 5. O adversário obtém M₁ ⊕ M₂ e revela as mensagens na prática
        res_m1_m2 = MarkupText("<b>Resultado: <i>C</i>₁ ⊕ <i>C</i>₂ = <i>M</i>₁ ⊕ <i>M</i>₂ = [ 52  12  6B ]</b>", font_size=20, color=RED_B).shift(DOWN * 1.4)
        self.play(Transform(xor_conta, res_m1_m2), run_time=1.0)
        self.wait(1.5)

        # Revelação prática das palavras claras
        decod_box = RoundedRectangle(corner_radius=0.15, width=9.5, height=0.9, stroke_color=EMERALD, fill_color=EMERALD, fill_opacity=0.15).shift(DOWN * 2.5)
        decod_texto = MarkupText("<b>Mensagens Descobertas:</b>  <i>M</i>₁ = <b>'SOL'</b>  e  <i>M</i>₂ = <b>'LUA'</b>  (Sem conhecer <i>K</i>!)", font_size=18, color=EMERALD).move_to(decod_box.get_center())

        self.play(Create(decod_box), Write(decod_texto), run_time=1.2)
        self.wait(3.5)
