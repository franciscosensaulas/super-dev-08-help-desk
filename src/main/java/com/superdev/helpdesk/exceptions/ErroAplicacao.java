package com.superdev.helpdesk.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base das exceções de domínio. Os serviços lançam estas exceções sem saber
 * nada de HTTP; o TratadorDeErros traduz cada uma para status + corpo padrão
 */
@Getter
public class ErroAplicacao extends RuntimeException {
    // Atributos protegidos com final para n permitir a mudança
    // Com Getter (que permitirá somente a leitura), sem Setter + final
    private final HttpStatus status;
    private final String codigo;

    // Construtor
    protected ErroAplicacao(HttpStatus status, String codigo, String mensagem){
        // passando para o construtor da classe Pai (RuntimeExceptioin) a mensagem
        super(mensagem);
        this.status = status;
        this.codigo = codigo;
    }
}
