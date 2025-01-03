package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class CashHandlerService {

    private final RestTemplate restTemplate;

    public String postingToCashApi(PaymentRequest paymentRequest) {

        try {
            final String url = "https://cash.example.com/transactions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + "my-secret-token-cash");

            HttpEntity<PaymentRequest> httpEntity = new HttpEntity<>(paymentRequest, headers);

            log.info("Posting to Cash API: {}", paymentRequest);
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    httpEntity,
                    String.class
            );
            log.info("Response from Cash API: {}", response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        }catch (Exception ex) {
            log.error("Cash service response error: {}", ex.getMessage());
        }
        return null;
    }
}
