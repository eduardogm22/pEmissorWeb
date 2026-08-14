package org.tcc.eduardo.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        if (e instanceof WebApplicationException webException) {
            return Response
                    .status(webException.getResponse().getStatus())
                    .entity(Map.of("message", e.getMessage()))
                    .build();
        }
        return Response.serverError()
                .entity(Map.of("message", e.getMessage()))
                .build();
    }
}
