package com.HomeLens_backend.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "security.jwt")
@Data
public class JwtProperties {

    private String secretKey;
    private long accessTokenExpirationMinutes = 15;
    private long refreshTokenExpirationMinutes = 60 * 24 * 30;
}
