package com.HomeLens_backend.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final int OTP_LENGTH = 6;

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Random random = new Random();
    private final Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();

    public String sendOtp(String mobileNumber) {
        String otp = generateOtp();
        Instant expiresAt = Instant.now().plus(OTP_TTL);
        otpStore.put(mobileNumber, new OtpDetails(otp, expiresAt));

        // In a production environment, this should integrate with an SMS gateway.
        log.info("Generated OTP {} for mobile {} (expires at {})", otp, mobileNumber, expiresAt);
        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String otp) {
        OtpDetails details = otpStore.get(mobileNumber);
        if (details == null) {
            return false;
        }

        if (details.expiresAt().isBefore(Instant.now())) {
            otpStore.remove(mobileNumber);
            return false;
        }

        boolean matches = details.code().equals(otp);
        if (matches) {
            otpStore.remove(mobileNumber);
        }
        return matches;
    }

    private String generateOtp() {
        int bound = (int) Math.pow(10, OTP_LENGTH);
        int number = random.nextInt(bound);
        return String.format("%0" + OTP_LENGTH + "d", number);
    }

    private record OtpDetails(String code, Instant expiresAt) {
    }
}
