package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.dto.CardRequest;
import com.web.backend_byspring.dto.CardResponse;
import com.web.backend_byspring.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cards")
public class CardController {

    private final CardService cardService;

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody CardRequest cardRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(cardService.create(cardRequest)), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(value = "id") Long id, @RequestBody CardRequest cartRequest){
        return new ResponseEntity<>(ApiResponse.successResponse(cardService.update(cartRequest, id)), HttpStatus.OK);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<CardResponse>> findByCustomerId(@PathVariable Long customerId) {
        List<CardResponse> cartRespones = cardService.findByCustomerId(customerId);
        return ResponseEntity.ok(cartRespones);
    }

    @GetMapping("")
    public ResponseEntity<List<CardResponse>> findAll() {
        List<CardResponse> cardRespones = cardService.findAll();
        return ResponseEntity.ok(cardRespones);
    }

    @DeleteMapping("/{id}/customers/{customerId}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @PathVariable Long customerId) {
            cardService.delete(customerId, id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
