package com.example.gateway;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
@Configuration
public class SpringCloudConfiguration {
	@Bean
	RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
		return
				builder
				.routes()
				.route("helloservice", r->r.path("/rest/service/**")
				.filters(f->f.addResponseHeader("X-Response-Header","World"))
				.uri("http://localhost:8071"))
				.build();
	}
}