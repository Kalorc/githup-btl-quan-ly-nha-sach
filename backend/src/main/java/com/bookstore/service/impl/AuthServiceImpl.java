package com.bookstore.service.impl;

import com.bookstore.dto.AuthRequest;
import com.bookstore.dto.AuthResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(AuthRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Email không tồn tại");
            return response;
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Sai mật khẩu");
            return response;
        }

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage("Đăng nhập thành công");
        response.setToken("TOKEN-" + user.getId());
        response.setUserId(user.getId().toString());
        return response;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            AuthResponse response = new AuthResponse();
            response.setSuccess(false);
            response.setMessage("Email đã tồn tại!");
            return response;
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage("Đăng ký thành công!");
        response.setUserId(savedUser.getId().toString());
        return response;
    }
}
