package org.tcc.eduardo.dto;

import org.tcc.eduardo.entity.CaseEntity;
import org.tcc.eduardo.enums.TipoDoc;

import java.time.LocalDateTime;

public record CaseOutDTO(
        Long id,
        String nome,
        String descricao,
        String conteudo,
        TipoDoc tipoDoc,
        Long idProprietario,
        String nomeProprietario,
        Long idCopiadoDe,
        String nomeCopiadoDe,
        LocalDateTime dhUltimaEmissao,
        Integer qtdUsos,
        boolean favorito
) {
    public static CaseOutDTO fromEntity(CaseEntity caseEntity) {
        return new CaseOutDTO(
            caseEntity.id,
            caseEntity.nome,
            caseEntity.descricao,
            caseEntity.conteudo,
            caseEntity.tipoDoc,
            caseEntity.proprietario.id,
            caseEntity.proprietario.nome + " " + caseEntity.proprietario.sobrenome,
            caseEntity.copiadoDe != null ? caseEntity.copiadoDe.id : null,
            caseEntity.copiadoDe != null ? caseEntity.copiadoDe.nome + " " + caseEntity.copiadoDe.sobrenome : "",
            caseEntity.dhUltimaEmissao,
            caseEntity.qtdUsos,
            caseEntity.favorito
        );
    }
}
