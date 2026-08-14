package org.tcc.eduardo.dto;

import java.util.Map;

public record RespDTO(
        String resultado,
        String Mensagem,
        String chaveAcesso,
        Map<String, String> mapOutrasInfo
) {
}
