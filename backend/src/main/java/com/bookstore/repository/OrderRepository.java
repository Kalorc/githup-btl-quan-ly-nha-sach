package com.bookstore.repository;

import com.bookstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy tất cả đơn của một user
    List<Order> findByUser_Id(Long userId);
}
