package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;                    // ID đơn hàng (read-only cho FE)
    private String userId;              // User ID dạng String (FE gửi lên)

    private List<OrderItemDTO> items;   // Danh sách sản phẩm trong đơn

    private double total;               // Tổng tiền
    private String createdAt;           // Ngày tạo đơn (String cho FE dễ hiển thị)
}
