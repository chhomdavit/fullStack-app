package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Device;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class EmployeeRequest {

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

    private Date createdAt;

    private List<Device> devices;
}
