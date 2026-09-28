def validar_mensagem(mensagem: str) -> bool:
    """Valida se a mensagem contém no mínimo quatro palavras."""
    palavras = mensagem.strip().split()
    return len(palavras) >= 4


def gerar_chave_repetida(mensagem: str, chave: str) -> str:
    """Repete a chave até cobrir o tamanho da mensagem, alinhando apenas com caracteres alfabéticos."""
    chave_limpa = "".join(c for c in chave if c.isalpha())
    if not chave_limpa:
        raise ValueError("A chave deve conter ao menos uma letra.")

    chave_alinhada = []
    idx_chave = 0

    for char in mensagem:
        if char.isalpha():
            chave_alinhada.append(
                chave_limpa[idx_chave % len(chave_limpa)]
            )
            idx_chave += 1
        else:
            chave_alinhada.append(char)

    return "".join(chave_alinhada)


def encriptar(mensagem: str, chave: str) -> str:
    """Encripta uma mensagem utilizando a Cifra de Vigenère."""
    if not validar_mensagem(mensagem):
        raise ValueError("A mensagem deve conter no mínimo quatro palavras.")

    chave_alinhada = gerar_chave_repetida(mensagem, chave)
    resultado = []

    for m_char, k_char in zip(mensagem, chave_alinhada):
        if m_char.isalpha():
            base = ord("A") if m_char.isupper() else ord("a")
            shift = ord(k_char.upper()) - ord("A")
            novo_char = chr((ord(m_char) - base + shift) % 26 + base)
            resultado.append(novo_char)
        else:
            resultado.append(m_char)

    return "".join(resultado)


def decriptar(mensagem_cifrada: str, chave: str) -> str:
    """Decripta uma mensagem cifrada utilizando a Cifra de Vigenère."""
    chave_alinhada = gerar_chave_repetida(mensagem_cifrada, chave)
    resultado = []

    for c_char, k_char in zip(mensagem_cifrada, chave_alinhada):
        if c_char.isalpha():
            base = ord("A") if c_char.isupper() else ord("a")
            shift = ord(k_char.upper()) - ord("A")
            novo_char = chr((ord(c_char) - base - shift) % 26 + base)
            resultado.append(novo_char)
        else:
            resultado.append(c_char)

    return "".join(resultado)


# Exemplo de uso
# if __name__ == "__main__":
#    frase_original = "A cifra de Vigenere e polialfabetica"
#    chave_acesso = "CHAVE"
#
#    print(f"Frase Original: {frase_original}")
#    print(f"Chave utilizada: {chave_acesso}\n")
#
    # Encriptação
#    texto_cifrado = encriptar(frase_original, chave_acesso)
#    print(f"Texto Encriptado: {texto_cifrado}")

    # Decriptação
#    texto_decriptado = decriptar(texto_cifrado, chave_acesso)
#    print(f"Texto Decriptado: {texto_decriptado}")