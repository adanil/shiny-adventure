package com.producer2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Producer2 {
    public static void main(String[] args) {
        System.out.println("Producer-2 starts");
        SpringApplication.run(Producer2.class, args);
    }
}