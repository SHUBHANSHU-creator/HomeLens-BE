package com.HomeLens_backend.api.controller;

import com.HomeLens_backend.api.dto.AuthResponse;
import com.HomeLens_backend.api.dto.OtpRequest;
import com.HomeLens_backend.api.dto.RefreshRequest;
import com.HomeLens_backend.api.dto.VerifyOtpRequest;
import com.HomeLens_backend.api.service.JwtService;
import com.HomeLens_backend.api.service.OtpService;
import com.HomeLens_backend.api.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping({"/send-otp", "/otp/send"})
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        if (!isValidMobile(request.getMobileNumber())) {
            return ResponseEntity.badRequest().body("Invalid mobile number");
        }
        otpService.sendOtp(request.getMobileNumber());
        return ResponseEntity.ok().body("OTP sent successfully");
    }

    @PostMapping({"/verify-otp", "/otp/verify"})
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (!isValidMobile(request.getMobileNumber()) || !StringUtils.hasText(request.getOtp()) || !isValidDeviceId(request.getDeviceId())) {
            return ResponseEntity.badRequest().body("Invalid mobile number, OTP, or device");
        }

        boolean verified = otpService.verifyOtp(request.getMobileNumber(), request.getOtp());
        if (!verified) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }

        JwtService.TokenDetails accessToken = jwtService.generateAccessToken(request.getMobileNumber());
        JwtService.TokenDetails refreshToken = refreshTokenService.createAndStoreToken(request.getMobileNumber(), request.getDeviceId());

        return ResponseEntity.ok(new AuthResponse(
                accessToken.token(),
                accessToken.expiresAt(),
                refreshToken.token(),
                refreshToken.expiresAt()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshTokens(@RequestBody RefreshRequest request) {
        if (!StringUtils.hasText(request.getRefreshToken()) || !isValidDeviceId(request.getDeviceId())) {
            return ResponseEntity.badRequest().body("Invalid refresh request");
        }

        String mobileNumber;
        try {
            mobileNumber = jwtService.extractMobileNumber(request.getRefreshToken());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        boolean valid = refreshTokenService.isRefreshTokenValid(mobileNumber, request.getDeviceId(), request.getRefreshToken());
        if (!valid) {
            refreshTokenService.deleteRefreshToken(mobileNumber, request.getDeviceId());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }

        JwtService.TokenDetails newAccessToken = jwtService.generateAccessToken(mobileNumber);
        JwtService.TokenDetails newRefreshToken = refreshTokenService.createAndStoreToken(mobileNumber, request.getDeviceId());

        return ResponseEntity.ok(new AuthResponse(
                newAccessToken.token(),
                newAccessToken.expiresAt(),
                newRefreshToken.token(),
                newRefreshToken.expiresAt()
        ));
    }

    private boolean isValidMobile(String mobileNumber) {
        return StringUtils.hasText(mobileNumber) && mobileNumber.matches("\\d{8,15}");
    }

    private boolean isValidDeviceId(String deviceId) {
        return StringUtils.hasText(deviceId) && deviceId.length() <= 100;
    }
}
