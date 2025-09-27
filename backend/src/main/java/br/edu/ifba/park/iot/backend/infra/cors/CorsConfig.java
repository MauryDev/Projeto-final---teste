package br.edu.ifba.park.iot.backend.infra.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Mapeia todas as rotas da API ("/api/**")
        registry.addMapping("/**")
                // Permite requisições do seu frontend (por exemplo, localhost:3000)
                // Substitua esta URL pela URL de produção do seu frontend quando for fazer o
                // deploy
                .allowedOrigins("http://localhost:3000")
                // Permite os métodos HTTP que a sua API usa
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                // Permite o envio de headers na requisição
                .allowedHeaders("*")
                // Permite o envio de credenciais (cookies, tokens de autenticação)
                .allowCredentials(true);
    }
}
