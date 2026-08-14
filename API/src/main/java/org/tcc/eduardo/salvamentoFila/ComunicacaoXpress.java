package org.tcc.eduardo.salvamentoFila;

import jakarta.inject.Inject;
import org.tcc.eduardo.entity.PontoLeituraEntity;

import java.util.List;

public class ComunicacaoXpress {
    private final PontoLeituraEntity pontoLeituraEntity;
    private final GerenciadorConexaoPostgres gerenciadorConexaoPostgres;
    private final GerenciadorArquivosSMB gerenciadorArquivosSMB;

    public ComunicacaoXpress(PontoLeituraEntity pontoLeituraEntity) {
        this.pontoLeituraEntity = pontoLeituraEntity;
        this.gerenciadorConexaoPostgres = new GerenciadorConexaoPostgres(pontoLeituraEntity);
        this.gerenciadorArquivosSMB = new GerenciadorArquivosSMB(pontoLeituraEntity);
    }
    public void salvarNaFil(String conteudo, String nomeArquivo) {
        if (this.pontoLeituraEntity.tipoFila.equalsIgnoreCase("fila-banco")) {
            salvarArquivoTblFil(conteudo, nomeArquivo);
        } else if (false) {

        }
    }
    private void salvarArquivoPastaFil() {

    }
    private void salvarArquivoTblFil(String conteudo, String nomeArquivo) {
        gerenciadorConexaoPostgres.inserirRegistro(
                "fil",
                List.of(
                        1,
                        conteudo,
                        nomeArquivo
                )
        );
    }
}
