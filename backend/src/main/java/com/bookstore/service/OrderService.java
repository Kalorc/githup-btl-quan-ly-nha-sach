package com.bookstore.service;

import com.bookstore.dto.OrderDTO;

import java.util.List;

public interface OrderService {

    // Tạo đơn hàng mới
    String createOrder(OrderDTO request);

    // Lịch sử đơn hàng theo user
    List<OrderDTO> getHistory(String userId);
}
