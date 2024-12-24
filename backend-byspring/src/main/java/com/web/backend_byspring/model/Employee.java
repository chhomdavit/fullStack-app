package com.web.backend_byspring.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.Roles;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="tbl_employee")
public class Employee extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_Name", nullable = false, unique = true)
    private String fullName;

    private String firstName;

    private String lastName;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "gender", length = 10)
    private String gender;

    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    private String email;

    @Column(name = "phone_number", length = 15, nullable = false)
    private String phoneNumber;

    private String address;

    private Roles role;

    private String status;

    private int attempt;

    private LocalDateTime lastLogin;

    @ToString.Exclude
    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Device> devices;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

}
