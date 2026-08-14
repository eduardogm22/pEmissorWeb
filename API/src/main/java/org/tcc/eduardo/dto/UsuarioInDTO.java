package org.tcc.eduardo.dto;

import org.tcc.eduardo.entity.UsuarioEntity;
import org.tcc.eduardo.enums.Cargo;
import org.tcc.eduardo.enums.Equipe;

public record UsuarioInDTO(
    String username,
    String senha,
    String nome,
    String sobrenome,
    String email,
    Equipe equipe,
    Cargo cargo,
    Long idPontoLeitura
    ) {

    }