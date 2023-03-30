package com.producer1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Producer1 {
    public static void main(String[] args) {
        System.out.println("Producer-1 starts");
        SpringApplication.run(Producer1.class, args);
    }
}