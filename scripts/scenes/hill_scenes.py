"""
hill_scenes.py - Cenas Manim para demonstração didática da Cifra de Hill.
Contém:
1. HillEncodeScene: Codificação da mensagem no espaço modular 2D (com calma).
2. HillDecodeScene: Decodificação da mensagem com a matriz inversa modular K^-1.
"""

from manim import *

class HillEncodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Hill: Codificação Matricial 2D</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.4)
        subtitulo = MarkupText("Mapeamento Linear de Digramas: <b>c ≡ K • p (mod 26)</b>", font_size=18, color=GRAY).next_to(titulo, DOWN, buff=0.15)

        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(1.0)

        # 2. Apresentação do digrama e vetorização
        digrama_label = MarkupText("Texto Claro: <b>'HE'</b>  →  <i>H</i> = <b>7</b>,  <i>E</i> = <b>4</b>", font_size=21, color=BLUE_C).shift(UP * 1.5 + LEFT * 2.8)
        vetor_p_lbl = MarkupText("Vetor <b>p</b> = [7, 4]<sup>T</sup>", font_size=20, color=BLUE_B).next_to(digrama_label, DOWN, buff=0.2, aligned_edge=LEFT)
        matriz_k_lbl = MarkupText("Matriz <b>K</b> = [[3, 3], [2, 5]]", font_size=20, color=YELLOW_C).next_to(vetor_p_lbl, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(digrama_label), run_time=1.0)
        self.play(FadeIn(vetor_p_lbl), FadeIn(matriz_k_lbl), run_time=1.0)
        self.wait(1.0)

        # 3. Plano Cartesiano Discreto
        plane = NumberPlane(
            x_range=[0, 10, 2],
            y_range=[0, 10, 2],
            x_length=4.5,
            y_length=4.5,
            background_line_style={"stroke_opacity": 0.25, "stroke_color": GRAY_C},
            axis_config={"include_numbers": True, "font_size": 16}
        ).shift(RIGHT * 3.2 + DOWN * 0.4)

        p_point = plane.c2p(7, 4)
        c_point = plane.c2p(7, 8)

        vetor_p_arrow = Arrow(plane.c2p(0, 0), p_point, buff=0, color=BLUE_C, stroke_width=5)
        lbl_p_vec = MarkupText("<b>p</b>(7, 4)", font_size=16, color=BLUE_C).next_to(p_point, UR, buff=0.1)

        self.play(Create(plane), run_time=1.0)
        self.play(GrowArrow(vetor_p_arrow), FadeIn(lbl_p_vec), run_time=1.0)
        self.wait(1.2)

        # 4. Cálculo passo a passo com calma
        calc_t1 = MarkupText("<i>c</i>₁ = (3 • 7 + 3 • 4) = 33 ≡ <b>7</b> (mod 26)", font_size=18, color=WHITE).shift(DOWN * 0.4 + LEFT * 2.8)
        calc_t2 = MarkupText("<i>c</i>₂ = (2 • 7 + 5 • 4) = 34 ≡ <b>8</b> (mod 26)", font_size=18, color=WHITE).next_to(calc_t1, DOWN, buff=0.25, aligned_edge=LEFT)
        calc_res = MarkupText("Vetor Cifrado <b>c</b> = [<b>7</b>, <b>8</b>]<sup>T</sup>", font_size=20, color=GREEN_C).next_to(calc_t2, DOWN, buff=0.3, aligned_edge=LEFT)
        letras_c = MarkupText("Letras Cifradas: <b>7 → 'H'</b>, <b>8 → 'I'</b>  →  <b>'HI'</b>", font_size=20, color=GREEN_B).next_to(calc_res, DOWN, buff=0.25, aligned_edge=LEFT)

        self.play(Write(calc_t1), run_time=1.0)
        self.wait(0.8)
        self.play(Write(calc_t2), run_time=1.0)
        self.wait(0.8)
        self.play(Write(calc_res), run_time=0.8)

        # 5. Transformação contínua do vetor no plano
        vetor_c_arrow = Arrow(plane.c2p(0, 0), c_point, buff=0, color=GREEN_C, stroke_width=5)
        lbl_c_vec = MarkupText("<b>c</b>(7, 8)", font_size=16, color=GREEN_C).next_to(c_point, UR, buff=0.1)

        self.play(
            Transform(vetor_p_arrow, vetor_c_arrow),
            Transform(lbl_p_vec, lbl_c_vec),
            run_time=2.0
        )
        self.wait(0.8)
        self.play(Write(letras_c), run_time=1.0)
        self.wait(3.0)


class HillDecodeScene(Scene):
    def construct(self):
        # 1. Título e subtítulo
        titulo = MarkupText("<b>Cifra de Hill: Decodificação com a Matriz Inversa</b>", font_size=28, color=WHITE).to_edge(UP, buff=0.4)
        subtitulo = MarkupText("Recuperação Algébrica: <b>p ≡ K⁻¹ • c (mod 26)</b>", font_size=18, color=GRAY).next_to(titulo, DOWN, buff=0.15)

        self.play(FadeIn(titulo), FadeIn(subtitulo), run_time=0.8)
        self.wait(1.0)

        # 2. Apresentação do vetor cifrado e da inversa
        c_label = MarkupText("Texto Cifrado: <b>'HI'</b>  →  <i>H</i> = <b>7</b>,  <i>I</i> = <b>8</b>  (<b>c</b> = [7, 8]<sup>T</sup>)", font_size=20, color=GREEN_C).shift(UP * 1.5 + LEFT * 2.6)
        inv_label = MarkupText("Matriz Inversa: <b>K⁻¹</b> ≡ [[15, 17], [20, 9]] (mod 26)", font_size=20, color=TEAL_C).next_to(c_label, DOWN, buff=0.2, aligned_edge=LEFT)

        self.play(Write(c_label), run_time=1.0)
        self.play(FadeIn(inv_label), run_time=1.0)
        self.wait(1.0)

        # 3. Plano Cartesiano Discreto
        plane = NumberPlane(
            x_range=[0, 10, 2],
            y_range=[0, 10, 2],
            x_length=4.5,
            y_length=4.5,
            background_line_style={"stroke_opacity": 0.25, "stroke_color": GRAY_C},
            axis_config={"include_numbers": True, "font_size": 16}
        ).shift(RIGHT * 3.2 + DOWN * 0.4)

        c_point = plane.c2p(7, 8)
        p_point = plane.c2p(7, 4)

        vetor_c_arrow = Arrow(plane.c2p(0, 0), c_point, buff=0, color=GREEN_C, stroke_width=5)
        lbl_c_vec = MarkupText("<b>c</b>(7, 8)", font_size=16, color=GREEN_C).next_to(c_point, UR, buff=0.1)

        self.play(Create(plane), run_time=1.0)
        self.play(GrowArrow(vetor_c_arrow), FadeIn(lbl_c_vec), run_time=1.0)
        self.wait(1.2)

        # 4. Cálculo passo a passo com calma da reversão
        calc_t1 = MarkupText("<i>p</i>₁ = (15 • 7 + 17 • 8) = 241 ≡ <b>7</b> (mod 26)", font_size=18, color=WHITE).shift(DOWN * 0.4 + LEFT * 2.6)
        calc_t2 = MarkupText("<i>p</i>₂ = (20 • 7 + 9 • 8) = 212 ≡ <b>4</b> (mod 26)", font_size=18, color=WHITE).next_to(calc_t1, DOWN, buff=0.25, aligned_edge=LEFT)
        calc_res = MarkupText("Vetor Recuperado <b>p</b> = [<b>7</b>, <b>4</b>]<sup>T</sup>", font_size=20, color=BLUE_C).next_to(calc_t2, DOWN, buff=0.3, aligned_edge=LEFT)
        letras_p = MarkupText("Texto Original: <b>7 → 'H'</b>, <b>4 → 'E'</b>  →  <b>'HE'</b>", font_size=20, color=BLUE_B).next_to(calc_res, DOWN, buff=0.25, aligned_edge=LEFT)

        self.play(Write(calc_t1), run_time=1.0)
        self.wait(0.8)
        self.play(Write(calc_t2), run_time=1.0)
        self.wait(0.8)
        self.play(Write(calc_res), run_time=0.8)

        # 5. Transformação de retorno no plano
        vetor_p_arrow = Arrow(plane.c2p(0, 0), p_point, buff=0, color=BLUE_C, stroke_width=5)
        lbl_p_vec = MarkupText("<b>p</b>(7, 4)", font_size=16, color=BLUE_C).next_to(p_point, UR, buff=0.1)

        self.play(
            Transform(vetor_c_arrow, vetor_p_arrow),
            Transform(lbl_c_vec, lbl_p_vec),
            run_time=2.0
        )
        self.wait(0.8)
        self.play(Write(letras_p), run_time=1.0)
        self.wait(3.0)
