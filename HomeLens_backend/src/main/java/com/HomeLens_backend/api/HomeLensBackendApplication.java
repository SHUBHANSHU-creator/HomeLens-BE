package com.HomeLens_backend.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
public class HomeLensBackendApplication {

	public static void main(String[] args) {
        System.out.println("Welcome to HomeLensBackendApplication");
        SpringApplication.run(HomeLensBackendApplication.class, args);
	}

}
