package org.tcc.eduardo.resource;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.LoginDTO;
import org.tcc.eduardo.dto.PontoLeituraDTO;
import org.tcc.eduardo.dto.UsuarioInDTO;
import org.tcc.eduardo.dto.UsuarioOutDTO;
import org.tcc.eduardo.service.PontoLeituraService;
import org.tcc.eduardo.service.UsuarioService;

import java.util.List;

@Path("/pontoLeitura")
public class PontoLeituraResource {
    @Inject
    PontoLeituraService pontoLeituraService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response cadastrarPontoLeitura(PontoLeituraDTO pontoLeituraDTO) {
        PontoLeituraDTO PontoLeituraDTO = pontoLeituraService.cadastraPontoLeitura(pontoLeituraDTO);
        return Response.ok(PontoLeituraDTO).build();
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/usuario/{idUsuario}")
    public Response retornarPontosLeituraUsuario( @PathParam("idUsuario") Long idUsuario ) {
        List<PontoLeituraDTO> lstPontosLeitura = pontoLeituraService.retornaPontosLeituraUsuario(idUsuario);
        return Response.ok(lstPontosLeitura).build();
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/ativo/{idUsuario}")
    public Response retornarPontoLeituraAtivo( @PathParam("idUsuario") Long idUsuario ) {
        return Response.ok(pontoLeituraService.retornaPontoLeituraAtivo(idUsuario)).build();
    }
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/ativo/{idUsuario}/{idPontoLeitura}")
    public Response atualizarPontoLeituraAtivo( @PathParam("idUsuario") Long idUsuario, @PathParam("idPontoLeitura") Long idPontoLeitura ) {
        pontoLeituraService.atualizaPontoLeituraAtivo(idUsuario, idPontoLeitura);
        return Response.ok().build();
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response retornarPontoLeituraPorId(@PathParam("id") Long id) {
        PontoLeituraDTO pontoLeituraDTO = pontoLeituraService.retornaPontoLeituraPorId(id);
        return Response.ok(pontoLeituraDTO).build();
    }
    @PUT
    @Path("/{id}")
    public Response atualizarPontoLeitura(@PathParam("id") Long id, PontoLeituraDTO pontoLeituraDTO) {
        pontoLeituraService.atualizaPontoLeitura(id, pontoLeituraDTO);
        return Response.noContent().build();
    }
    @DELETE
    @Path("/{id}")
    public Response excluirPontoLeitura(@PathParam("id") Long id) {
        pontoLeituraService.excluiPontoLeitura(id);
        return Response.noContent().build();
    }
}
