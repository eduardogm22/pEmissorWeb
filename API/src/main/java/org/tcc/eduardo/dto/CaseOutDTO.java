package org.tcc.eduardo.dto;

import org.tcc.eduardo.enums.TipoDoc;

public record CaseInDTO(
        String nome,
        String descricao,
        String conteudo,
        TipoDoc tipoDoc,
        Long idProprietario,
        Long idCopiadoDe,
        boolean favorito
) {
}
