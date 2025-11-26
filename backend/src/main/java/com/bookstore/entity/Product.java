package com.bookstore.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    private String id;   // S01, S02... hoặc SP01...

    private String name;
    private double price;

    private String category;  // "book", "rent", "vpp"

    private String image;     // ảnh sản phẩm
    
    private String description;  // mô tả sản phẩm
}
