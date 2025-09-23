package br.edu.ifba.park.iot.backend.model.dto.reservation.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ReservationResponseDto {
  private Long id;
  private Long resourceId;
  private String resourceName;
  private Long userId;
  private String userName;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
}