package com.bookstore.service.impl;

import com.bookstore.dto.ProductDTO;
import com.bookstore.entity.Product;
import com.bookstore.repository.ProductRepository;
import com.bookstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getCategory(),
                        p.getImage(),
                        p.getDescription()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(String id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getCategory(),
                p.getImage(),
                p.getDescription()
        );
    }
}
