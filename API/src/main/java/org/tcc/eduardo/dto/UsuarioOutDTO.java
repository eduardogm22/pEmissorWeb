package org.tcc.eduardo.dto;

import org.tcc.eduardo.entity.UsuarioEntity;
import org.tcc.eduardo.enums.Cargo;
import org.tcc.eduardo.enums.Equipe;

public record UsuarioOutDTO(
    Long id,
    String username,
    String nome,
    String sobrenome,
    String email,
    Equipe equipe,
    Cargo cargo,
    Long pontoLeituraAtivo
    ) {
        public static UsuarioOutDTO fromEntity(UsuarioEntity entity) {
            return new UsuarioOutDTO(
                    entity.id,
                    entity.username,
                    entity.nome,
                    entity.sobrenome,
                    entity.email,
                    entity.equipe,
                    entity.cargo,
                    (entity.pontoLeituraAtivo == null) ? null : entity.pontoLeituraAtivo.id
            );
        }
    }