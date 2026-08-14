package org.tcc.eduardo.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.tcc.eduardo.dto.EmissaoDTO;
import org.tcc.eduardo.entity.CaseEntity;
import org.tcc.eduardo.dto.RespDTO;
import org.tcc.eduardo.entity.UsuarioEntity;
import org.tcc.eduardo.factory.EmissaoStrategyFactory;
import org.tcc.eduardo.salvamentoFila.ComunicacaoXpress;
import org.tcc.eduardo.salvamentoFila.GerenciadorArquivosSMB;
import org.tcc.eduardo.strategy.EmissaoStrategy;

import java.time.LocalDateTime;

@ApplicationScoped
public class EnviarXpressService {
    @Inject
    EmissaoStrategyFactory emissaoStrategyFactory;

    @Transactional
    public RespDTO emitirDocumento(EmissaoDTO emissaoDTO) {
        int timeoutSegundos = 60;

        UsuarioEntity usuarioEntity = UsuarioEntity.findById(emissaoDTO.idUsuario());
        if (usuarioEntity == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        if (usuarioEntity.pontoLeituraAtivo == null) {
            throw new NotFoundException("Usuário não tem ponto de leitura ativo! Selecione um ponto de leitura em Configurações do Sistema.");
        }
        ComunicacaoXpress comunicacaoXpress = new ComunicacaoXpress(usuarioEntity.pontoLeituraAtivo);

        CaseEntity caseEntity = CaseEntity.findById(emissaoDTO.idCase());
        boolean isCaseCadastrado = caseEntity != null;

        EmissaoStrategy strategy = emissaoStrategyFactory.getStrategy(emissaoDTO.tipoDoc());

        strategy.setConteudo(emissaoDTO.conteudo());

        strategy.processarCase();

        String nomeArquivo = strategy.montaNomeArquivo();

        comunicacaoXpress.salvarNaFil(strategy.getConteudo(), nomeArquivo);

        String conteudoResp = "";
        LocalDateTime horaini = LocalDateTime.now();
        do {
            conteudoResp = "";// smb.lerArquivo("resp-" + nomeArquivo);
        } while ( conteudoResp.isBlank() || horaini.plusSeconds(timeoutSegundos).isAfter(LocalDateTime.now()) );

        if (conteudoResp.isBlank()) {
            throw new InternalServerErrorException("Timeout! Verifique o Xpress.");
        }
        return strategy.processarResposta(conteudoResp);
    }
    public void teste() {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(1);
        ComunicacaoXpress comunicacaoXpress = new ComunicacaoXpress(usuarioEntity.pontoLeituraAtivo);
        comunicacaoXpress.salvarNaFil("teste", "teste");
    }
}
