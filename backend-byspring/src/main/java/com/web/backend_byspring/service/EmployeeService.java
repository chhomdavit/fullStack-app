package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.*;

public interface EmployeeService {

    EmployeeRespones create(EmployeeRequest employeeRequest);

    EmployeeRespones update(EmployeeRequest employeeRequest, Long id);

    EmployeeRespones login(EmployeeRequest employeeRequest);

    EmployeeRespones refreshToken(RefreshTolenRequest refreshTolenRequest);

    EmployeeRespones getMyInfo(EmployeeRequest employeeRequest);

    PaginationResponse<EmployeeRespones> getAllWithPagination(String keyword, int pageNumber, int pageSize);
}
