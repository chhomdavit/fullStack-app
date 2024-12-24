package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Employee;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRespones {

    private Long id;

    @JsonProperty(value = "device_id")
    private String deviceId;

    @JsonProperty(value = "device_type")
    private String deviceType;

    @JsonProperty(value = "device_model")
    private String deviceModel;

    @JsonProperty(value = "os_version")
    private String osVersion;

    @JsonProperty(value = "app_version")
    private String appVersion;

    @JsonProperty(value = "last_login")
    private Date lastLogin;

    @JsonProperty(value = "trust_device")
    private boolean trustDevice;

    private String status;

    private Employee employee;

    private Customer customer;
}
