package org.tcc.eduardo.factory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import org.tcc.eduardo.enums.TipoDoc;
import org.tcc.eduardo.strategy.EmissaoStrategy;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class EmissaoStrategyFactory {
    Map<TipoDoc, EmissaoStrategy> mapStrategies = new HashMap<>();

    @Inject
    public EmissaoStrategyFactory(Instance<EmissaoStrategy> emissaoStrategyInstance) {
        for (EmissaoStrategy strategy : emissaoStrategyInstance) {
            mapStrategies.put(
                    strategy.getTipoDoc(),
                    strategy
            );
        }
    }
    public EmissaoStrategy getStrategy(TipoDoc tipoDoc) {
        EmissaoStrategy strategy = mapStrategies.get(tipoDoc);
        if (strategy == null) {
            throw new BadRequestException("Tipo de documento não suportado para emissão!");
        }
        return strategy;
    }
}
