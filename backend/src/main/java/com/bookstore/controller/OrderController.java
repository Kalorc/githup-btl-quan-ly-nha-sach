package com.bookstore.controller;

import com.bookstore.dto.OrderDTO;
import com.bookstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Tạo đơn hàng (mua / thuê)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO order) {
        String message = orderService.createOrder(order);
        return ResponseEntity.ok(message);
    }

    // Lấy lịch sử đơn hàng của user
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(@PathVariable String userId) {
        // TODO: Kiểm tra userId từ JWT token để xác thực
        // For now: Allow all (future: extract userId từ SecurityContext)
        
        // SECURITY: Validate userId is valid
        try {
            Long.valueOf(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        
        List<OrderDTO> history = orderService.getHistory(userId);
        return ResponseEntity.ok(history);
    }
}
