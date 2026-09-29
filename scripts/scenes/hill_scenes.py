"""
hill_scenes.py - Cenas Manim para demonstração didática da Cifra de Hill.
Contém:
1. HillEncodeScene: Codificação com calma do 1º vetor e codificação contínua de múltiplos blocos ('CRIPTO').
2. HillDecodeScene: Decodificação com calma do 1º vetor com a matriz inversa e decodificação contínua dos múltiplos blocos.
"""

from manim import *

EMERALD = "#10b981"

class HillEncodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Hill: Codificação Matricial por Blocos</b>", font_size=26, color=WHITE).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Transformação Linear Modular: <b>c ≡ K • p (mod 26)</b>", font_size=17, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(2.5)

        # 2. Divisão da mensagem "CRIPTO" em blocos de digramas
        txt_header = MarkupText("Mensagem Clara: <b>'CRIPTO'</b> (dividida em blocos 2x1)", font_size=19, color=BLUE_C).shift(UP * 1.8 + LEFT * 2.8)
        blocos_lbl = MarkupText(
            "<b>p₁ = 'CR' = [2, 17]ᵀ</b>    <b>p₂ = 'IP' = [8, 15]ᵀ</b>    <b>p₃ = 'TO' = [19, 14]ᵀ</b>",
            font_size=16,
            color=BLUE_B
        ).next_to(txt_header, DOWN, buff=0.2, aligned_edge=LEFT)
        matriz_k = MarkupText("Matriz Chave <b>K</b> = [[3, 3], [2, 5]]", font_size=17, color=YELLOW_C).next_to(blocos_lbl, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(txt_header), run_time=0.8)
        self.play(FadeIn(blocos_lbl), FadeIn(matriz_k), run_time=0.8)
        self.wait(2.5)

        # 3. Plano Cartesiano Discreto no lado direito
        plane = NumberPlane(
            x_range=[0, 26, 5],
            y_range=[0, 26, 5],
            x_length=4.4,
            y_length=4.4,
            background_line_style={"stroke_opacity": 0.25, "stroke_color": GRAY_C},
            axis_config={"include_numbers": True, "font_size": 13}
        ).shift(RIGHT * 3.4 + DOWN * 0.4)

        self.play(Create(plane), run_time=1.0)
        self.wait(1.5)

        # 4. FASE 1: Detalhe aprofundado do 1º Vetor p1 = 'CR'
        fase1_lbl = MarkupText("<b>1º Bloco com Calma: p₁ = 'CR' [2, 17]ᵀ</b>", font_size=18, color=TEAL_C).shift(DOWN * 0.2 + LEFT * 2.8)
        self.play(FadeIn(fase1_lbl), run_time=0.7)

        # Desenhar p1 no plano
        p1_pt = plane.c2p(2, 17)
        c1_pt = plane.c2p(5, 11)
        vetor_arrow = Arrow(plane.c2p(0, 0), p1_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_vec = MarkupText("<b>p₁</b>(2, 17)", font_size=15, color=BLUE_C).next_to(p1_pt, UR, buff=0.1)

        self.play(GrowArrow(vetor_arrow), FadeIn(lbl_vec), run_time=1.0)
        self.wait(2.0)

        # Contas passo a passo com calma
        calc1 = MarkupText("<i>c</i>₁₁ = (3 • 2 + 3 • 17) = 57 ≡ <b>5 ('F')</b> (mod 26)", font_size=16, color=WHITE).next_to(fase1_lbl, DOWN, buff=0.25, aligned_edge=LEFT)
        calc2 = MarkupText("<i>c</i>₁₂ = (2 • 2 + 5 • 17) = 89 ≡ <b>11 ('L')</b> (mod 26)", font_size=16, color=WHITE).next_to(calc1, DOWN, buff=0.2, aligned_edge=LEFT)
        res1 = MarkupText("Bloco Cifrado 1: <b>c₁ = [5, 11]ᵀ → 'FL'</b>", font_size=18, color=GREEN_C).next_to(calc2, DOWN, buff=0.25, aligned_edge=LEFT)

        self.play(Write(calc1), run_time=1.0)
        self.wait(2.0)
        self.play(Write(calc2), run_time=1.0)
        self.wait(2.0)
        self.play(Write(res1), run_time=0.8)

        # Animar a transformação linear no plano
        vetor_c1 = Arrow(plane.c2p(0, 0), c1_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_c1 = MarkupText("<b>c₁</b>(5, 11)", font_size=15, color=GREEN_C).next_to(c1_pt, UR, buff=0.1)

        self.play(
            Transform(vetor_arrow, vetor_c1),
            Transform(lbl_vec, lbl_c1),
            run_time=2.0
        )
        self.wait(3.0)

        # 5. FASE 2: Transformação em lote dos vetores seguintes
        self.play(
            FadeOut(fase1_lbl),
            FadeOut(calc1),
            FadeOut(calc2),
            FadeOut(res1),
            run_time=0.6
        )

        fase2_lbl = MarkupText("<b>Processamento dos Blocos Seguintes:</b>", font_size=18, color=YELLOW_C).shift(DOWN * 0.2 + LEFT * 2.8)
        self.play(FadeIn(fase2_lbl), run_time=0.6)
        self.wait(1.5)

        # Vetor 2: p2 = 'IP' = [8, 15] -> c2 = [17, 13] -> 'RN'
        p2_pt = plane.c2p(8, 15)
        c2_pt = plane.c2p(17, 13)
        vetor_p2 = Arrow(plane.c2p(0, 0), p2_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_p2 = MarkupText("<b>p₂</b>(8, 15)", font_size=15, color=BLUE_C).next_to(p2_pt, UR, buff=0.1)

        info_p2 = MarkupText("2º Bloco: <b>p₂ = 'IP' [8, 15]ᵀ</b>", font_size=16, color=BLUE_C).next_to(fase2_lbl, DOWN, buff=0.25, aligned_edge=LEFT)
        self.play(FadeIn(info_p2), Transform(vetor_arrow, vetor_p2), Transform(lbl_vec, lbl_p2), run_time=1.0)
        self.wait(2.0)

        vetor_c2 = Arrow(plane.c2p(0, 0), c2_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_c2 = MarkupText("<b>c₂</b>(17, 13)", font_size=15, color=GREEN_C).next_to(c2_pt, UR, buff=0.1)
        res_p2 = MarkupText("K • [8, 15]ᵀ ≡ [17, 13]ᵀ → <b>'RN'</b>", font_size=16, color=GREEN_C).next_to(info_p2, DOWN, buff=0.15, aligned_edge=LEFT)

        self.play(
            Transform(vetor_arrow, vetor_c2),
            Transform(lbl_vec, lbl_c2),
            Write(res_p2),
            run_time=1.5
        )
        self.wait(2.2)

        # Vetor 3: p3 = 'TO' = [19, 14] -> c3 = [21, 4] -> 'VE'
        p3_pt = plane.c2p(19, 14)
        c3_pt = plane.c2p(21, 4)
        vetor_p3 = Arrow(plane.c2p(0, 0), p3_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_p3 = MarkupText("<b>p₃</b>(19, 14)", font_size=15, color=BLUE_C).next_to(p3_pt, UR, buff=0.1)

        info_p3 = MarkupText("3º Bloco: <b>p₃ = 'TO' [19, 14]ᵀ</b>", font_size=16, color=BLUE_C).next_to(res_p2, DOWN, buff=0.25, aligned_edge=LEFT)
        self.play(FadeIn(info_p3), Transform(vetor_arrow, vetor_p3), Transform(lbl_vec, lbl_p3), run_time=1.0)
        self.wait(2.0)

        vetor_c3 = Arrow(plane.c2p(0, 0), c3_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_c3 = MarkupText("<b>c₃</b>(21, 4)", font_size=15, color=GREEN_C).next_to(c3_pt, UR, buff=0.1)
        res_p3 = MarkupText("K • [19, 14]ᵀ ≡ [21, 4]ᵀ → <b>'VE'</b>", font_size=16, color=GREEN_C).next_to(info_p3, DOWN, buff=0.15, aligned_edge=LEFT)

        self.play(
            Transform(vetor_arrow, vetor_c3),
            Transform(lbl_vec, lbl_c3),
            Write(res_p3),
            run_time=1.5
        )
        self.wait(2.5)

        # 6. Conclusão e concatenação do criptograma completo
        final_box = RoundedRectangle(corner_radius=0.15, width=6.2, height=1.1, stroke_color=EMERALD, fill_color=BLACK, fill_opacity=0.85).shift(DOWN * 2.8 + LEFT * 2.8)
        final_text = MarkupText("<b>Criptograma: 'FL' + 'RN' + 'VE' = 'FLRNVE'</b>", font_size=17, color=EMERALD).move_to(final_box.get_center())

        self.play(Create(final_box), Write(final_text), run_time=1.0)
        self.wait(3.5)


class HillDecodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Hill: Decodificação com a Matriz Inversa</b>", font_size=26, color=WHITE).to_edge(UP, buff=0.35)
        subtitulo = MarkupText("Recuperação Algébrica Modular: <b>p ≡ K⁻¹ • c (mod 26)</b>", font_size=17, color=GRAY).next_to(titulo, DOWN, buff=0.15)
        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(2.5)

        # 2. Apresentação dos blocos cifrados e da matriz inversa
        txt_header = MarkupText("Criptograma: <b>'FLRNVE'</b> (dividido em blocos 2x1)", font_size=19, color=GREEN_C).shift(UP * 1.8 + LEFT * 2.8)
        blocos_lbl = MarkupText(
            "<b>c₁ = 'FL' = [5, 11]ᵀ</b>    <b>c₂ = 'RN' = [17, 13]ᵀ</b>    <b>c₃ = 'VE' = [21, 4]ᵀ</b>",
            font_size=16,
            color=GREEN_B
        ).next_to(txt_header, DOWN, buff=0.2, aligned_edge=LEFT)
        matriz_inv = MarkupText("Matriz Inversa <b>K⁻¹</b> ≡ [[15, 17], [20, 9]] (mod 26)", font_size=17, color=TEAL_C).next_to(blocos_lbl, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(txt_header), run_time=0.8)
        self.play(FadeIn(blocos_lbl), FadeIn(matriz_inv), run_time=0.8)
        self.wait(2.5)

        # 3. Plano Cartesiano Discreto no lado direito
        plane = NumberPlane(
            x_range=[0, 26, 5],
            y_range=[0, 26, 5],
            x_length=4.4,
            y_length=4.4,
            background_line_style={"stroke_opacity": 0.25, "stroke_color": GRAY_C},
            axis_config={"include_numbers": True, "font_size": 13}
        ).shift(RIGHT * 3.4 + DOWN * 0.4)

        self.play(Create(plane), run_time=1.0)
        self.wait(1.5)

        # 4. FASE 1: Decodificação detalhada do 1º Vetor com calma
        fase1_lbl = MarkupText("<b>1º Bloco com Calma: c₁ = 'FL' [5, 11]ᵀ</b>", font_size=18, color=TEAL_C).shift(DOWN * 0.2 + LEFT * 2.8)
        self.play(FadeIn(fase1_lbl), run_time=0.7)

        # Desenhar c1 no plano
        c1_pt = plane.c2p(5, 11)
        p1_pt = plane.c2p(2, 17)
        vetor_arrow = Arrow(plane.c2p(0, 0), c1_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_vec = MarkupText("<b>c₁</b>(5, 11)", font_size=15, color=GREEN_C).next_to(c1_pt, UR, buff=0.1)

        self.play(GrowArrow(vetor_arrow), FadeIn(lbl_vec), run_time=1.0)
        self.wait(2.0)

        # Contas passo a passo da multiplicação por K^-1 com calma
        calc1 = MarkupText("<i>p</i>₁₁ = (15 • 5 + 17 • 11) = 262 ≡ <b>2 ('C')</b> (mod 26)", font_size=16, color=WHITE).next_to(fase1_lbl, DOWN, buff=0.25, aligned_edge=LEFT)
        calc2 = MarkupText("<i>p</i>₁₂ = (20 • 5 + 9 • 11) = 199 ≡ <b>17 ('R')</b> (mod 26)", font_size=16, color=WHITE).next_to(calc1, DOWN, buff=0.2, aligned_edge=LEFT)
        res1 = MarkupText("Bloco Recuperado 1: <b>p₁ = [2, 17]ᵀ → 'CR'</b>", font_size=18, color=BLUE_C).next_to(calc2, DOWN, buff=0.25, aligned_edge=LEFT)

        self.play(Write(calc1), run_time=1.0)
        self.wait(2.0)
        self.play(Write(calc2), run_time=1.0)
        self.wait(2.0)
        self.play(Write(res1), run_time=0.8)

        # Animar a reversão vetorial no plano
        vetor_p1 = Arrow(plane.c2p(0, 0), p1_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_p1 = MarkupText("<b>p₁</b>(2, 17)", font_size=15, color=BLUE_C).next_to(p1_pt, UR, buff=0.1)

        self.play(
            Transform(vetor_arrow, vetor_p1),
            Transform(lbl_vec, lbl_p1),
            run_time=2.0
        )
        self.wait(3.0)

        # 5. FASE 2: Decodificação dos blocos seguintes
        self.play(
            FadeOut(fase1_lbl),
            FadeOut(calc1),
            FadeOut(calc2),
            FadeOut(res1),
            run_time=0.6
        )

        fase2_lbl = MarkupText("<b>Decodificação dos Blocos Seguintes:</b>", font_size=18, color=YELLOW_C).shift(DOWN * 0.2 + LEFT * 2.8)
        self.play(FadeIn(fase2_lbl), run_time=0.6)
        self.wait(1.5)

        # Vetor 2: c2 = 'RN' = [17, 13] -> p2 = [8, 15] -> 'IP'
        c2_pt = plane.c2p(17, 13)
        p2_pt = plane.c2p(8, 15)
        vetor_c2 = Arrow(plane.c2p(0, 0), c2_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_c2 = MarkupText("<b>c₂</b>(17, 13)", font_size=15, color=GREEN_C).next_to(c2_pt, UR, buff=0.1)

        info_c2 = MarkupText("2º Bloco: <b>c₂ = 'RN' [17, 13]ᵀ</b>", font_size=16, color=GREEN_C).next_to(fase2_lbl, DOWN, buff=0.25, aligned_edge=LEFT)
        self.play(FadeIn(info_c2), Transform(vetor_arrow, vetor_c2), Transform(lbl_vec, lbl_c2), run_time=1.0)
        self.wait(2.0)

        vetor_p2 = Arrow(plane.c2p(0, 0), p2_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_p2 = MarkupText("<b>p₂</b>(8, 15)", font_size=15, color=BLUE_C).next_to(p2_pt, UR, buff=0.1)
        res_c2 = MarkupText("K⁻¹ • [17, 13]ᵀ ≡ [8, 15]ᵀ → <b>'IP'</b>", font_size=16, color=BLUE_C).next_to(info_c2, DOWN, buff=0.15, aligned_edge=LEFT)

        self.play(
            Transform(vetor_arrow, vetor_p2),
            Transform(lbl_vec, lbl_p2),
            Write(res_c2),
            run_time=1.5
        )
        self.wait(2.2)

        # Vetor 3: c3 = 'VE' = [21, 4] -> p3 = [19, 14] -> 'TO'
        c3_pt = plane.c2p(21, 4)
        p3_pt = plane.c2p(19, 14)
        vetor_c3 = Arrow(plane.c2p(0, 0), c3_pt, buff=0, color=GREEN_C, stroke_width=4)
        lbl_c3 = MarkupText("<b>c₃</b>(21, 4)", font_size=15, color=GREEN_C).next_to(c3_pt, UR, buff=0.1)

        info_c3 = MarkupText("3º Bloco: <b>c₃ = 'VE' [21, 4]ᵀ</b>", font_size=16, color=GREEN_C).next_to(res_c2, DOWN, buff=0.25, aligned_edge=LEFT)
        self.play(FadeIn(info_c3), Transform(vetor_arrow, vetor_c3), Transform(lbl_vec, lbl_c3), run_time=1.0)
        self.wait(2.0)

        vetor_p3 = Arrow(plane.c2p(0, 0), p3_pt, buff=0, color=BLUE_C, stroke_width=4)
        lbl_p3 = MarkupText("<b>p₃</b>(19, 14)", font_size=15, color=BLUE_C).next_to(p3_pt, UR, buff=0.1)
        res_c3 = MarkupText("K⁻¹ • [21, 4]ᵀ ≡ [19, 14]ᵀ → <b>'TO'</b>", font_size=16, color=BLUE_C).next_to(info_c3, DOWN, buff=0.15, aligned_edge=LEFT)

        self.play(
            Transform(vetor_arrow, vetor_p3),
            Transform(lbl_vec, lbl_p3),
            Write(res_c3),
            run_time=1.5
        )
        self.wait(2.5)

        # 6. Conclusão e concatenação do texto recuperado
        final_box = RoundedRectangle(corner_radius=0.15, width=6.2, height=1.1, stroke_color=BLUE_C, fill_color=BLACK, fill_opacity=0.85).shift(DOWN * 2.8 + LEFT * 2.8)
        final_text = MarkupText("<b>Texto Original: 'CR' + 'IP' + 'TO' = 'CRIPTO'</b>", font_size=17, color=BLUE_C).move_to(final_box.get_center())

        self.play(Create(final_box), Write(final_text), run_time=1.0)
        self.wait(3.5)
