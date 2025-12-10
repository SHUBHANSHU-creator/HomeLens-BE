package com.HomeLens_backend.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Random;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final int OTP_LENGTH = 6;
    private static final String OTP_KEY_PREFIX = "otp:";

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Random random = new Random();
    private final StringRedisTemplate redisTemplate;

    public OtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String sendOtp(String mobileNumber) {
        String otp = generateOtp();
        Instant expiresAt = Instant.now().plus(OTP_TTL);
        redisTemplate.opsForValue().set(buildKey(mobileNumber), otp, OTP_TTL);

        // In a production environment, this should integrate with an SMS gateway.
        log.info("Generated OTP {} for mobile {} (expires at {})", otp, mobileNumber, expiresAt);
        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String otp) {
        String cachedOtp = redisTemplate.opsForValue().get(buildKey(mobileNumber));
        if (cachedOtp == null) {
            return false;
        }

        boolean matches = cachedOtp.equals(otp);
        if (matches) {
            redisTemplate.delete(buildKey(mobileNumber));
        }
        return matches;
    }

    private String generateOtp() {
        int bound = (int) Math.pow(10, OTP_LENGTH);
        int number = random.nextInt(bound);
        return String.format("%0" + OTP_LENGTH + "d", number);
    }

    private String buildKey(String mobileNumber) {
        return OTP_KEY_PREFIX + mobileNumber;
    }
}
