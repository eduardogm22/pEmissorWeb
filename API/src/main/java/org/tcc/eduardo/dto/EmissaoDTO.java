package org.tcc.eduardo.dto;

import org.tcc.eduardo.enums.TipoDoc;

public record EmissaoDTO(
    Long idCase,
    Long idUsuario,
    TipoDoc tipoDoc,
    String conteudo,
    DadosEmissaoDTO dadosEmissao
) {

}
