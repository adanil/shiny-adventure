package com.producer1.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("convert")
public class ExchangeController {

    @Value("${instance.name}")
    private String instanceName;
    @GetMapping("from/{firstCurrency}/to/{secondCurrency}")
    public Map<String, Object> exchange(@PathVariable String firstCurrency, @PathVariable String secondCurrency,
                                        @RequestParam int value) {
        HashMap<String, Object> response = new HashMap<>();
        response.put(secondCurrency,value * 0.013);
        response.put("instanceId", instanceName);
        return response;
    }
}
