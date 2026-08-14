package org.tcc.eduardo.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.tcc.eduardo.dto.EmissaoDTO;
import org.tcc.eduardo.dto.RespDTO;
import org.tcc.eduardo.service.EnviarXpressService;

@Path("/xpress")
public class EnviarXpressResource {
    @Inject
    EnviarXpressService enviarXpressService;

    @POST
    public Response EnviarXpress(EmissaoDTO emissaoDTO) {
        RespDTO resp = enviarXpressService.emitirDocumento(emissaoDTO);
        return Response.ok(resp).build();
    }
    @GET
    public Response teste() {
        enviarXpressService.teste();
        return Response.ok().build();
    }
}
