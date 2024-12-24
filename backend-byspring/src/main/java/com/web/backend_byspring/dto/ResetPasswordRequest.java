package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String email;

    @JsonProperty(value = "verfication_code")
    private String verficationCode;

    @JsonProperty(value = "new_password")
    private String newPassword;

}
