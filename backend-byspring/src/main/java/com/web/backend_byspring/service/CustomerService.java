package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.CustomerRequest;
import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.dto.RefreshTolenRequest;
import com.web.backend_byspring.dto.ResetPasswordRequest;

import java.util.List;

public interface CustomerService {

    CustomerRespones create(CustomerRequest customerRequest);

    CustomerRespones update(CustomerRequest customerRequest, Long id);

    void verify(CustomerRequest customerRequest);

    CustomerRespones login(CustomerRequest customerRequest);

    void forgotPassword(CustomerRequest customerRequest);

    void resetPassword(ResetPasswordRequest resetPasswordRequest);

    CustomerRespones refreshToken(RefreshTolenRequest refreshTolenRequest);

    List<CustomerRespones> getAll();
}
