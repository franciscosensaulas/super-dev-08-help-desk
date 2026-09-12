package com.superdev.helpdesk.dtos.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
* Record é uma classe para armazenar dados imutáveis
* */
public record UsuarioCriarDto (
    @NotBlank @Size(min=2, max=100)
    String nome,

    @NotBlank @Email @Size(max = 150)
    String email
){}
