package com.example.ClientLB;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.reactive.function.client.WebClient;


@SpringBootApplication
public class ClientLbApplication {

	public static void main(String[] args) throws InterruptedException {
		ConfigurableApplicationContext ctx = new SpringApplicationBuilder(ClientLbApplication.class)
				.web(WebApplicationType.NONE)
				.run(args);

		WebClient loadBalancedClient = ctx.getBean(WebClient.Builder.class).build();

		while (true) {
			String response = loadBalancedClient.get().uri("http://producers/convert/from/RUB/to/USD?value=5433")
					.retrieve().toEntity(String.class).block().getBody();
			System.out.println(response);
			Thread.sleep(5000);
		}
	}

}
