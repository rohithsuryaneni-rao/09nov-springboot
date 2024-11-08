package com.example.gateway.controller;

import org.apache.hc.core5.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FallBackController {
	@RequestMapping("/myfallback")
	public ResponseEntity<String>fallBackController()
	{
		return
				ResponseEntity.status(
						HttpStatus.
						SC_INTERNAL_SERVER_ERROR).body("please try  ..>");
	}
}