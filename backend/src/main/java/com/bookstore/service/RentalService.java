package com.bookstore.service;

import com.bookstore.dto.RentalDTO;
import java.util.List;

public interface RentalService {

    String rentBook(RentalDTO request);

    List<RentalDTO> getRenting(String userId);

    String returnBook(Long rentalId);
}
