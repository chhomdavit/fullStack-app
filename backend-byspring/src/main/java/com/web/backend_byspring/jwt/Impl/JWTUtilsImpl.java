package com.web.backend_byspring.jwt.Impl;


import com.web.backend_byspring.constant.AppConstants;
import com.web.backend_byspring.jwt.JWTUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Component
public class JWTUtilsImpl implements JWTUtils {
	
    private SecretKey Key;

    public JWTUtilsImpl() {
      byte[] keyBytes = Base64.getDecoder().decode(AppConstants.SECRET_KEY.getBytes(StandardCharsets.UTF_8));
      this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

	@Override
	public String generateToken(UserDetails userDetails) {
		return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + AppConstants.ACCESSTOKEN_EXPIRATION_TIME))
                .signWith(Key)
                .compact();
	}

	@Override
	public String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails) {
		 return Jwts.builder()
	                .claims(claims)
	                .subject(userDetails.getUsername())
	                .issuedAt(new Date(System.currentTimeMillis()))
	                .expiration(new Date(System.currentTimeMillis() + AppConstants.REFRESHTOKEN_EXPIRATION_TIME))
	                .signWith(Key)
	                .compact();
	}

	@Override
	public String extractUsername(String token) {
		return extractClaims(token, Claims::getSubject);
	}
	
	private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(Jwts.parser()
                .verifyWith(Key)
                .build()
                .parseSignedClaims(token)
                .getPayload());
    }

	@Override
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	@Override
	public boolean isTokenExpired(String token) {
		 return extractClaims(token, Claims::getExpiration).before(new Date());
	}
}
