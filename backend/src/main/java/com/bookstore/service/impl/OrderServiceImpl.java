package com.bookstore.service.impl;

import com.bookstore.dto.OrderDTO;
import com.bookstore.dto.OrderItemDTO;
import com.bookstore.entity.Order;
import com.bookstore.entity.OrderItem;
import com.bookstore.entity.Product;
import com.bookstore.entity.User;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.ProductRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public String createOrder(OrderDTO request) {

        // 1. Lấy user
        Long userId = Long.valueOf(request.getUserId());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Tạo Order
        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDate.now());

        // 3. Map items từ DTO sang entity
        double total = 0.0;

        for (OrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(product.getPrice()); // Lưu giá tại thời điểm mua

            total += product.getPrice() * itemDTO.getQuantity();

            order.getItems().add(item);
        }

        order.setTotal(total);

        // 4. Lưu DB (cascade ALL sẽ tự lưu OrderItem)
        orderRepository.save(order);

        return "Tạo đơn hàng thành công! ID = " + order.getId();
    }

    @Override
    public List<OrderDTO> getHistory(String userIdStr) {

        Long userId = Long.valueOf(userIdStr);

        List<Order> orders = orderRepository.findByUser_Id(userId);

        return orders.stream().map(order -> {

            OrderDTO dto = new OrderDTO();
            dto.setId(order.getId());
            dto.setUserId(order.getUser().getId().toString());
            dto.setTotal(order.getTotal());
            dto.setCreatedAt(order.getCreatedAt() != null
                    ? order.getCreatedAt().toString()
                    : null);

            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(item -> new OrderItemDTO(
                            item.getProduct().getId(),
                            item.getQuantity(),
                            item.getPrice()  // Include giá tại thời điểm mua
                    ))
                    .collect(Collectors.toList());

            dto.setItems(itemDTOs);

            return dto;
        }).collect(Collectors.toList());
    }
}
