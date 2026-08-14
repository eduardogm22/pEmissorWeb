package org.tcc.eduardo.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.PontoLeituraDTO;
import org.tcc.eduardo.entity.PontoLeituraEntity;
import org.tcc.eduardo.entity.UsuarioEntity;

import java.util.List;
import java.util.stream.Stream;


@ApplicationScoped
public class PontoLeituraService {
    @Transactional
    public PontoLeituraDTO cadastraPontoLeitura(PontoLeituraDTO pontoLeituraDTO) {
        if ( PontoLeituraEntity.findByName(pontoLeituraDTO.nome()) != null ) {
            throw new ClientErrorException("Já existe um ponto de leitura com esse nome.", Response.Status.CONFLICT);
        }
        if ( pontoLeituraDTO.tipoFila().equalsIgnoreCase("fila-banco") ) {
            if (pontoLeituraDTO.tipoBanco().isBlank()) {
                throw new BadRequestException("O campo tipo do banco é obrigatório!");
            }
            if (pontoLeituraDTO.porta().isBlank()) {
                throw new BadRequestException("O campo porta é obrigatório!");
            }
            if (pontoLeituraDTO.nomeBanco().isBlank()) {
                throw new BadRequestException("O campo nome do banco é obrigatório!");
            }
        }
        if (pontoLeituraDTO.idUsuario() == null) { throw new BadRequestException("idUsuario não pode ser nulo!"); }
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(pontoLeituraDTO.idUsuario());
        if (usuarioEntity == null) { throw new NotFoundException("Usuário não encontrado!"); }

        PontoLeituraEntity pontoLeituraEntity = new PontoLeituraEntity(
                pontoLeituraDTO.nome(),
                pontoLeituraDTO.tipoFila(),
                pontoLeituraDTO.tipoBanco(),
                pontoLeituraDTO.nomeBanco(),
                pontoLeituraDTO.ipv4(),
                pontoLeituraDTO.porta(),
                pontoLeituraDTO.usuario(),
                pontoLeituraDTO.senha(),
                pontoLeituraDTO.dominio(),
                usuarioEntity
        );

        pontoLeituraEntity.persist();

        return PontoLeituraDTO.fromEntity(pontoLeituraEntity);
    }
    public List<PontoLeituraDTO> retornaPontosLeituraUsuario(Long idUsuario) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(idUsuario);
        if (usuarioEntity == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }
        try ( Stream<PontoLeituraEntity> stream = usuarioEntity.pontosLeitura.stream() ) {
            return stream
                .map(PontoLeituraDTO::fromEntity)
                .toList();
        }
    }
    @Transactional
    public void atualizaPontoLeituraAtivo(Long idUsuario, Long idPontoLeitura) {
        UsuarioEntity usuario = UsuarioEntity.findById(idUsuario);
        if (usuario == null) {
            throw new NotFoundException("Usuário não encontrado!");
        }

        usuario.pontoLeituraAtivo = PontoLeituraEntity.findById(idPontoLeitura);
        usuario.persist();
    }
    public PontoLeituraDTO retornaPontoLeituraPorId(Long id) {
        PontoLeituraEntity pontoLeituraEntity = PontoLeituraEntity.findById(id);
        if (pontoLeituraEntity == null) {
            throw new NotFoundException();
        }
        return PontoLeituraDTO.fromEntity(pontoLeituraEntity);
    }
    public PontoLeituraDTO retornaPontoLeituraAtivo(Long usuario_id) {
        UsuarioEntity usuarioEntity = UsuarioEntity.findById(usuario_id);
        PontoLeituraEntity pontoLeituraEntity = usuarioEntity.pontoLeituraAtivo;

        if (pontoLeituraEntity == null) { return null; }
        return PontoLeituraDTO.fromEntity(pontoLeituraEntity);
    }
    @Transactional
    public void atualizaPontoLeitura(Long id, PontoLeituraDTO pontoLeituraDTO) {
        PontoLeituraEntity pontoLeituraEntity = PontoLeituraEntity.findById(id);
        if (pontoLeituraEntity == null) {
            throw new NotFoundException("Ponto de leitura não encontrado!");
        }
        if (PontoLeituraEntity.findByName(pontoLeituraDTO.nome()) != null && !pontoLeituraEntity.nome.equalsIgnoreCase(pontoLeituraDTO.nome())) {
            throw new ClientErrorException("Já existe um ponto de leitura com esse nome.", Response.Status.CONFLICT);
        }

        pontoLeituraEntity.nome    = pontoLeituraDTO.nome();
        pontoLeituraEntity.usuario = pontoLeituraDTO.usuario();
        pontoLeituraEntity.senha = pontoLeituraDTO.senha();
        pontoLeituraEntity.dominio = pontoLeituraDTO.dominio();
        pontoLeituraEntity.ipv4 = pontoLeituraDTO.ipv4();
        pontoLeituraEntity.tipoBanco = pontoLeituraDTO.tipoBanco();
        pontoLeituraEntity.nomeBanco = pontoLeituraDTO.nomeBanco();
        pontoLeituraEntity.tipoFila = pontoLeituraDTO.tipoFila();
    }
    @Transactional
    public void excluiPontoLeitura(Long id) {
        if (!PontoLeituraEntity.deleteById(id)) {
            throw new NotFoundException("Ponto de leitura não encontrado!");
        }
    }
}
