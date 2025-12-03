package com.HomeLens_backend.api.controller;

import com.HomeLens_backend.api.dto.AuthResponse;
import com.HomeLens_backend.api.dto.OtpRequest;
import com.HomeLens_backend.api.dto.VerifyOtpRequest;
import com.HomeLens_backend.api.service.JwtService;
import com.HomeLens_backend.api.service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthController(OtpService otpService, JwtService jwtService) {
        this.otpService = otpService;
        this.jwtService = jwtService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        if (!isValidMobile(request.getMobileNumber())) {
            return ResponseEntity.badRequest().body("Invalid mobile number");
        }
        otpService.sendOtp(request.getMobileNumber());
        return ResponseEntity.ok().body("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (!isValidMobile(request.getMobileNumber()) || !StringUtils.hasText(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid mobile number or OTP");
        }

        boolean verified = otpService.verifyOtp(request.getMobileNumber(), request.getOtp());
        if (!verified) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }

        JwtService.TokenDetails tokenDetails = jwtService.generateToken(request.getMobileNumber());
        return ResponseEntity.ok(new AuthResponse(tokenDetails.token(), tokenDetails.expiresAt()));
    }

    private boolean isValidMobile(String mobileNumber) {
        return StringUtils.hasText(mobileNumber) && mobileNumber.matches("\\d{8,15}");
    }
}
