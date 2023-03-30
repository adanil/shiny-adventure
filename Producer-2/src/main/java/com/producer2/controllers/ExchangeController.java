package com.producer2.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("convert")
public class ExchangeController {
    private final String instanceName = "Producer-2";
    @GetMapping("from/{firstCurrency}/to/{secondCurrency}")
    public Map<String, Object> echange(@PathVariable String firstCurrency, @PathVariable String secondCurrency,
                                       @RequestParam int value) {
        HashMap<String, Object> response = new HashMap<>();
        response.put(secondCurrency,value * 0.013);
        response.put("instanceId", instanceName);
        return response;
    }
}