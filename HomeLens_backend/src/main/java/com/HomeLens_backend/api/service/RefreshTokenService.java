package com.HomeLens_backend.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String REFRESH_PREFIX = "refresh:";

    private final StringRedisTemplate redisTemplate;
    private final JwtService jwtService;

    public JwtService.TokenDetails createAndStoreToken(String mobileNumber, String deviceId) {
        JwtService.TokenDetails tokenDetails = jwtService.generateRefreshToken(mobileNumber, deviceId);
        Duration ttl = Duration.between(Instant.now(), tokenDetails.expiresAt());
        redisTemplate.opsForValue().set(buildKey(mobileNumber, deviceId), tokenDetails.token(), ttl);
        return tokenDetails;
    }

    public boolean isRefreshTokenValid(String mobileNumber, String deviceId, String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            return false;
        }

        String tokenMobile = jwtService.extractMobileNumber(refreshToken);
        String tokenDeviceId = jwtService.extractDeviceId(refreshToken);
        if (!mobileNumber.equals(tokenMobile) || !deviceId.equals(tokenDeviceId)) {
            return false;
        }

        String storedToken = redisTemplate.opsForValue().get(buildKey(mobileNumber, deviceId));
        return StringUtils.hasText(storedToken) && storedToken.equals(refreshToken);
    }

    public void deleteRefreshToken(String mobileNumber, String deviceId) {
        redisTemplate.delete(buildKey(mobileNumber, deviceId));
    }

    private String buildKey(String mobileNumber, String deviceId) {
        return REFRESH_PREFIX + mobileNumber + ":" + deviceId;
    }
}
