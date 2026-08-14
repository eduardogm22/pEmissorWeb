package org.tcc.eduardo.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.DadosEmissaoDTO;
import org.tcc.eduardo.service.DadosEmissaoService;

@Path("/dadosEmissao")
public class DadosEmissaoResource {
    @Inject
    DadosEmissaoService dadosEmissaoService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response cadastrarDadosEmissao(DadosEmissaoDTO dadosEmissaoDTO) {
        DadosEmissaoDTO dadosEmissaoOutDTO = dadosEmissaoService.cadastra(dadosEmissaoDTO);
        return Response.ok(dadosEmissaoDTO).build();
    }
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    public Response retornaPorUsuario_id(@PathParam("id") Long usuario_id) {
        DadosEmissaoDTO dadosEmissaoDTO = dadosEmissaoService.retornaPorUsuario_id(usuario_id);
        return Response.ok(dadosEmissaoDTO).build();
    }
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response AtualizaDadosEmissao(DadosEmissaoDTO dadosEmissaoDTO) {
        DadosEmissaoDTO dadosEmissaoOutDTO = dadosEmissaoService.atualiza(dadosEmissaoDTO);
        return Response.ok(dadosEmissaoDTO).build();
    }
    @DELETE
    @Path("/{id}")
    public Response deletaPorUsuario_id(@PathParam("id") Long usuario_id) {
        dadosEmissaoService.deleta(usuario_id);
        return Response.noContent().build();
    }
}
