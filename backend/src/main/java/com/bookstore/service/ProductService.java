package com.bookstore.service;

import com.bookstore.dto.ProductDTO;
import java.util.List;

public interface ProductService {

    List<ProductDTO> getAllProducts();

    ProductDTO getProductById(String id);
}
