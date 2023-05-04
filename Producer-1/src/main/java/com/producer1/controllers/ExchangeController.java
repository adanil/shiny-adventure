package com.producer1.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("convert")
public class ExchangeController {

    private static final Logger log = LoggerFactory.getLogger(ExchangeController.class);

    @Value("${instance.name}")
    private String instanceName;
    @GetMapping("from/{firstCurrency}/to/{secondCurrency}")
    public Map<String, Object> exchange(@PathVariable String firstCurrency, @PathVariable String secondCurrency,
                                        @RequestParam int value) {
        log.info(instanceName + " get exchange request: " + firstCurrency + " to " + secondCurrency + " value = " + value);
        HashMap<String, Object> response = new HashMap<>();
        float result = (float) (value * 0.013);
        response.put(secondCurrency, result);
        response.put("instanceId", instanceName);
        log.info(instanceName + " send response: " + secondCurrency + " = " + result);
        return response;
    }
}
