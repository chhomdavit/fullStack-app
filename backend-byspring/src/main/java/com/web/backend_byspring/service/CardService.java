package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.CardRequest;
import com.web.backend_byspring.dto.CardResponse;

import java.util.List;

public interface CardService {

    CardResponse create(CardRequest cardRequest);

    CardResponse update(CardRequest cardRequest, Long id);

    void delete(Long customerId, Long id);

    List<CardResponse> findByCustomerId(Long customerId);

    List<CardResponse> findAll();
}
