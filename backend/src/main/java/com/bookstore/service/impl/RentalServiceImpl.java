package com.bookstore.service.impl;

import com.bookstore.dto.RentalDTO;
import com.bookstore.entity.Product;
import com.bookstore.entity.Rental;
import com.bookstore.entity.User;
import com.bookstore.repository.ProductRepository;
import com.bookstore.repository.RentalRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public String rentBook(RentalDTO request) {

        Long userId = Long.valueOf(request.getUserId());

        // 1. Lấy user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Lấy product
        Product product = productRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 3. Tạo Rental object
        Rental rental = new Rental();
        rental.setUser(user);
        rental.setProduct(product);

        LocalDate today = LocalDate.now();
        rental.setRentDate(today);
        rental.setReturnDate(today.plusDays(request.getDays()));
        rental.setActualReturnDate(null); // chưa trả

        // 4. Lưu
        rentalRepository.save(rental);

        return "Thuê sách thành công!";
    }

    @Override
    public List<RentalDTO> getRenting(String userId) {

        Long uid = Long.valueOf(userId);

        List<Rental> rentals = rentalRepository.findByUser_Id(uid);

        return rentals.stream()
                .filter(r -> r.getActualReturnDate() == null) // Chỉ lấy những cuốn chưa trả
                .map(r -> new RentalDTO(
                        r.getUser().getId().toString(),
                        r.getProduct().getId(),
                        (int) ChronoUnit.DAYS.between(r.getRentDate(), r.getReturnDate()) // days còn lại
                ))
                .collect(Collectors.toList());
    }

    @Override
    public String returnBook(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        rental.setActualReturnDate(LocalDate.now());
        rentalRepository.save(rental);

        // Kiểm tra quá hạn
        LocalDate returnDate = rental.getReturnDate();
        LocalDate actualReturn = rental.getActualReturnDate();

        if (actualReturn.isAfter(returnDate)) {
            long daysLate = ChronoUnit.DAYS.between(returnDate, actualReturn);
            return "Trả sách thành công! (Quá hạn " + daysLate + " ngày)";
        }

        return "Trả sách thành công!";
    }
}
