package com.HomeLens_backend.api.service;

import com.HomeLens_backend.api.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    ResponseEntity<?> createUser(User user);
}
