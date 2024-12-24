package com.web.backend_byspring.repository;

import com.web.backend_byspring.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    Optional<Card> findByCustomerIdAndProductId(Long customerId, Long productId);

    List<Card> findByCustomerId(Long customerId);
}
