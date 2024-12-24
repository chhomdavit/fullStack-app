package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.Roles;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class CustomerRequest {

    private String email;

    private String name;

    private String password;

    @JsonProperty(value = "is_verified")
    private Boolean isVerified;

    @JsonProperty(value = "verfication_code")
    private String verficationCode;

    @JsonProperty(value = "verfication_code_expires_at")
    private LocalDateTime verficationCodeExpiresAt;

    private int attempt;

    private String status;

    @JsonProperty(value = "last_login")
    private LocalDateTime lastLogin;

    private LocalDateTime created;

    private LocalDateTime updated;

    private Roles role;
}
