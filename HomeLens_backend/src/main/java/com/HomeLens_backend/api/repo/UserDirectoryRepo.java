package com.HomeLens_backend.api.repo;

import com.HomeLens_backend.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserDirectoryRepo extends JpaRepository<User, Long> {
    boolean findByMobileNumber(String mobileNumber);

    boolean existsByMobileNumber(String mobileNumber);
}
