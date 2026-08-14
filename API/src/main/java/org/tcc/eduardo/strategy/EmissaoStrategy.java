package org.tcc.eduardo.strategy;

import org.tcc.eduardo.enums.TipoDoc;

import java.util.Map;

public interface EmissaoStrategy {
    String conteudo = "";
    String getConteudo();
    void setConteudo(String conteudo);

    TipoDoc getTipoDoc();

    String montaNomeArquivo();

    String processarCase();

    <T> T processarResposta(String resposta);
}
