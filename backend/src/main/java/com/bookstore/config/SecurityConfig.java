package com.bookstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())              // Tắt CSRF (REST API không cần)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()          // Cho phép toàn bộ API (chưa bảo mật)
                )
                .cors(cors -> {});                         // Bật CORS (để CorsConfig hoạt động)

        return http.build();
    }
}
