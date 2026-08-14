package org.tcc.eduardo.dto;

import org.tcc.eduardo.entity.PontoLeituraEntity;

public record PontoLeituraDTO(
    Long id,
    String nome,
    String tipoFila,
    String tipoBanco,
    String nomeBanco,
    String ipv4,
    String porta,
    String usuario,
    String senha,
    String dominio,
    Long idUsuario
) {
    public static PontoLeituraDTO fromEntity(PontoLeituraEntity entity) {
        return new PontoLeituraDTO(
            entity.id,
            entity.nome = entity.nome,
            entity.tipoFila,
            entity.tipoBanco,
            entity.nomeBanco,
            entity.ipv4,
            entity.porta,
            entity.usuario,
            entity.senha,
            entity.dominio,
            entity.usuarioEntity.id
        );
    }
}
