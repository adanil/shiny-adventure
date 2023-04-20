package com.example.ClientLB;

import com.example.ClientLB.services.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.List;


@SpringBootApplication
@EnableDiscoveryClient
public class ClientLbApplication {
	public static void main(String[] args) throws InterruptedException {
		ConfigurableApplicationContext ctx = new SpringApplicationBuilder(ClientLbApplication.class)
				.web(WebApplicationType.NONE)
				.run(args);

		ExchangeService exchangeService = new ExchangeService(ctx);

		while (true) {
			exchangeService.requestExchange("RUB","USD",3999);
			Thread.sleep(5000);
		}
	}

}
