package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.Roles;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerRespones {

    private Long id;

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

    @JsonProperty(value = "access_token")
    private String accessToken;

    @JsonProperty(value = "refresh_token")
    private String refreshToken;
}
