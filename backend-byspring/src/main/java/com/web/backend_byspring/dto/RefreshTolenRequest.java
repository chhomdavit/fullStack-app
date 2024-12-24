package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTolenRequest {

    @JsonProperty(value = "refresh_token")
    private String refreshToken;
}
