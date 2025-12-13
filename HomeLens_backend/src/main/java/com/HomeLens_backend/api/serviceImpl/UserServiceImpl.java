package com.HomeLens_backend.api.serviceImpl;


import com.HomeLens_backend.api.entity.User;
import com.HomeLens_backend.api.repo.UserDirectoryRepo;
import com.HomeLens_backend.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDirectoryRepo userDirectoryRepo;

    @Override
    public ResponseEntity<?> createUser(User user) {
        log.info("Inside createUser - {}", user);
        if(!isValidUserRequest(user)){
            return ResponseEntity.badRequest().build();
        }
        try{
            userDirectoryRepo.save(user);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();

    }
    public boolean isValidUserRequest(User user){
        if(user == null && user.getUserName() == null){
            return false;
        }
        return true;
    }
}
