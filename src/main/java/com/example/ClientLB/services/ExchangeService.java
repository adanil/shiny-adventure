package com.example.ClientLB.services;

import io.github.resilience4j.spring6.circuitbreaker.configure.CircuitBreakerConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ExchangeService {

    private LoadBalancerClient loadBalancer;

    private final CircuitBreaker circuitBreaker;

    private final RestTemplate restTemplate;


    public ExchangeService(ConfigurableApplicationContext ctx) {
        this.circuitBreaker = ctx.getBean(CircuitBreakerFactory.class).create("exchange");
        this.loadBalancer = ctx.getBean(LoadBalancerClient.class);
        this.restTemplate = ctx.getBean(RestTemplateBuilder.class).build();
    }

    public String getServiceUrl() {
        ServiceInstance si = loadBalancer.choose("Producer");
        return si.getUri().toString();
    }


    public void requestExchange(String fromCurrency, String toCurrency, int value) {
        String serviceURL = getServiceUrl();
        String response = circuitBreaker.run(
                () -> this.restTemplate.getForObject(serviceURL + "/convert/from/" + fromCurrency + "/to/" + toCurrency + "?value=" + value,String.class),
                throwable -> "Exchange server is currently unavailable");
        System.out.println(response);
    }
}
