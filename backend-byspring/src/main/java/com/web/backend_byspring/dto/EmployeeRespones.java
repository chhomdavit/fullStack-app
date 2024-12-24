package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Device;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeRespones {

    private Long id;

    @JsonProperty(value = "full_name")
    private String fullName;

    @JsonProperty(value = "first_name")
    private String firstName;

    @JsonProperty(value = ("last_name"))
    private String lastName;

    private String password;

    private String gender;

    @JsonProperty(value = "dob")
    private String dateOfBirth;

    private String email;

    @JsonProperty(value = "phone_number")
    private String phoneNumber;

    private String address;

    private Roles role;

    private String status;

    private int attempt;

    @JsonProperty(value = "last_login")
    private LocalDateTime lastLogin;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty(value = "access_token")
    private String accessToken;

    @JsonProperty(value = "refresh_token")
    private String refreshToken;

    private List<Device> devices;
}
