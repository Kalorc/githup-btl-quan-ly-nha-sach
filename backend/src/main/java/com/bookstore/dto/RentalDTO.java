package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentalDTO {
    private String userId;   // FE gửi dạng String
    private String bookId;   // Product ID
    private int days;        // số ngày thuê
}
