package com.example.ClientLB.services;

import io.github.resilience4j.spring6.circuitbreaker.configure.CircuitBreakerConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ExchangeService {

    private final WebClient loadBalancedClient;

    private final CircuitBreaker circuitBreaker;

    public ExchangeService(ConfigurableApplicationContext ctx) {
        this.circuitBreaker = ctx.getBean(CircuitBreakerFactory.class).create("exchange");
        this.loadBalancedClient = ctx.getBean(WebClient.Builder.class).build();
    }


    public void requestExchange(String fromCurrency, String toCurrency, int value) {
        String response = circuitBreaker.run(() -> loadBalancedClient.get().uri("http://producers/convert/from/" + fromCurrency + "/to/" + toCurrency + "?value=" + value)
                .retrieve().toEntity(String.class).block().getBody(),
                throwable -> "Exchange server is currently unavailable");
        System.out.println(response);
    }
}
