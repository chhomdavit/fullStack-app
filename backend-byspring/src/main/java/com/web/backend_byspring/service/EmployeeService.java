package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.EmployeeRequest;
import com.web.backend_byspring.dto.EmployeeRespones;
import com.web.backend_byspring.dto.RefreshTolenRequest;

public interface EmployeeService {

    EmployeeRespones create(EmployeeRequest employeeRequest);

    EmployeeRespones update(EmployeeRequest employeeRequest, Long id);

    EmployeeRespones login(EmployeeRequest employeeRequest);

    EmployeeRespones refreshToken(RefreshTolenRequest refreshTolenRequest);
}
