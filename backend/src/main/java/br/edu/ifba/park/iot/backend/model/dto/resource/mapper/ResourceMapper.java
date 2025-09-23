package br.edu.ifba.park.iot.backend.model.dto.resource.mapper;

import br.edu.ifba.park.iot.backend.model.Resource;
import br.edu.ifba.park.iot.backend.model.dto.resource.request.ResourceRequestDto;
import br.edu.ifba.park.iot.backend.model.dto.resource.response.ResourceResponseDto;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class ResourceMapper {

  public static Resource toResource(ResourceRequestDto dto) {
    return new ModelMapper().map(dto, Resource.class);
  }

  public static ResourceResponseDto toDto(Resource resource) {
    return new ModelMapper().map(resource, ResourceResponseDto.class);
  }

  public static List<ResourceResponseDto> toListDto(List<Resource> resources) {
    return resources.stream()
        .map(resource -> toDto(resource))
        .collect(Collectors.toList());
  }
}