package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private String productId;  // ID của Product (S01, S02,…)
    private Integer quantity;      // Số lượng mua / thuê
    private Double price;      // Giá tại thời điểm mua (snapshot)

    // Constructor không có price (cho backward compatibility)
    public OrderItemDTO(String productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = 0.0;
    }
}
