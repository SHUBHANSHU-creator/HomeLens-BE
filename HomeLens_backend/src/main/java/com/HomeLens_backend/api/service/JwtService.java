package com.HomeLens_backend.api.service;

import com.HomeLens_backend.api.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;
    private final Key signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
    }

    public TokenDetails generateAccessToken(String mobileNumber) {
        return generateToken(mobileNumber, jwtProperties.getAccessTokenExpirationMinutes(), Map.of());
    }

    public TokenDetails generateRefreshToken(String mobileNumber, String deviceId) {
        return generateToken(
                mobileNumber,
                jwtProperties.getRefreshTokenExpirationMinutes(),
                Map.of("deviceId", deviceId)
        );
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getSubject() != null && claims.getExpiration() != null && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractMobileNumber(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractDeviceId(String token) {
        Object deviceId = parseClaims(token).get("deviceId");
        return deviceId != null ? deviceId.toString() : null;
    }

    private TokenDetails generateToken(String mobileNumber, long expirationMinutes, Map<String, Object> claims) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(expirationMinutes, ChronoUnit.MINUTES);

        String token = Jwts.builder()
                .setSubject(mobileNumber)
                .addClaims(claims)
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(expiresAt))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();

        return new TokenDetails(token, expiresAt);
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public record TokenDetails(String token, Instant expiresAt) {
    }
}
