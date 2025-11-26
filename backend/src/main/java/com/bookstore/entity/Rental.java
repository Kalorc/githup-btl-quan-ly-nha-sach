package com.bookstore.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "rentals")
@Data
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rent_date")
    private LocalDate rentDate;

    @Column(name = "return_date")
    private LocalDate returnDate;        // ngày phải trả

    @Column(name = "actual_return_date")
    private LocalDate actualReturnDate;  // ngày trả thật (NULL = chưa trả)

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product; // thuê sách nên product.category = "rent"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
