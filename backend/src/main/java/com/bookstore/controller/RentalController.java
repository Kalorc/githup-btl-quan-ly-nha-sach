package com.bookstore.controller;

import com.bookstore.dto.RentalDTO;
import com.bookstore.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rent")
@CrossOrigin
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // Thuê sách
    @PostMapping("/create")
    public ResponseEntity<?> rentBook(@RequestBody RentalDTO rental) {
        return ResponseEntity.ok(rentalService.rentBook(rental));
    }

    // Danh sách đang thuê
    @GetMapping("/list/{userId}")
    public ResponseEntity<List<RentalDTO>> getRentedBooks(@PathVariable String userId) {
        // TODO: Kiểm tra userId từ JWT token để xác thực
        
        // SECURITY: Validate userId is valid
        try {
            Long.valueOf(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(rentalService.getRenting(userId));
    }

    // Trả sách
    @PostMapping("/return/{rentalId}")
    public ResponseEntity<?> returnBook(@PathVariable Long rentalId) {
        return ResponseEntity.ok(rentalService.returnBook(rentalId));
    }
}
