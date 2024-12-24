package com.web.backend_byspring.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tbl_device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deviceId;

    private String deviceType;

    private String deviceModel;

    private String osVersion;

    private String appVersion;

    private Date lastLogin;

    private boolean trustDevice;

    private String status;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

}
