<h2 align="center">🅿️ Smart Parking IoT</h2>
<h3 align="center">🚗🏙️ Sistema de Estacionamento Inteligente com React e Spring Boot</h3>

## 📖 Introdução
O `Smart Parking IoT` é um sistema de **estacionamento inteligente com IOT** desenvolvido no contexto da disciplina de Programação **Web** Avançada, com foco na aplicação de conceitos modernos de desenvolvimento de sistemas distribuídos e seguros. A solução integra um `backend em Spring Boot` e um `frontend em React + TypeScript`, incorporando autenticação com `JWT`, gestão de vagas em tempo real e uma interface moderna e responsiva para o usuário. Com a integração de recursos de `IoT`, o sistema possibilita o monitoramento e a reserva de vagas de forma automatizada, demonstrando práticas de arquitetura em camadas, segurança robusta e comunicação eficiente entre os módulos.

---

## 📌 Objetivo
O objetivo do sistema é oferecer uma solução robusta e segura para o **gerenciamento de vagas de estacionamento**, permitindo:
- Reservas online de vagas 🚙  
- Autenticação segura via JWT 🔑  
- Monitoramento em tempo real de status das vagas 📡  
- Integração IoT para controle e automação ⚡  

---

## 🛠️ Tecnologias Utilizadas

### 🌐 Backend (Java + Spring Boot)
- **Spring Boot 3** – Framework principal  
- **Spring Security + JWT** – Autenticação e autorização  
- **Spring Data JPA** – Persistência de dados  
- **SpringDoc OpenAPI** – Documentação interativa com Swagger  
- **Flyway** – Migração e versionamento de banco de dados  
- **PostgreSQL** – Banco de dados relacional  
- **CORS Configurado** – Integração com frontend  
- **Exception Handling Global** – Tratamento robusto de erros  
- **TimeZone Configurada** – Garantia de consistência temporal  

📂 Estrutura de pacotes do backend:

```java
java/br/edu/ifba/park/iot/backend
├── audit
├── infra
├── jwt
├── model
├── repository
├── security
├── service
└── web
resources
├── db
├── static
├── templates
├── application.properties
├── application-dev.properties
└── application-test.properties
```
---

### 💻 Frontend (React + TypeScript)
- **Create React App (CRA)** com TypeScript  
- **React Router DOM** – Navegação entre páginas  
- **Axios** – Comunicação com backend  
- **Bootstrap 5** – Estilização responsiva  
- **Context API + Hooks** – Gerenciamento de estado  

📂 Estrutura do frontend:

```react
src
├── api
├── assets
├── components
├── context
├── hooks
├── pages
├── types
├── utils
├── App.tsx
└── index.tsx
```
---
## ⚙️ Como Executar o Projeto

### 🔹 Pré-requisitos
- [Node.js](https://nodejs.org/) (>= 18)  
- [Yarn](https://yarnpkg.com/)  
- [Java 17+](https://adoptium.net/)  
- [PostgreSQL](https://www.postgresql.org/)  

1. Clone o repositório:
```bash
git clone https://github.com/park-api-iot.git
cd backend
```
---
2. Configure o PostgreSQL e ajuste application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/estacionamento
spring.datasource.username=postgres
spring.datasource.password=senha
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```
3. Execute o projeto:
```java
./mvnw spring-boot:run
```
4. Acesse a documentação Swagger:
```properties
http://localhost:8080/swagger-ui.html
```
---
📌 Frontend (React + Typescript)
1. Vá até a pasta do frontend:
```bash
cd frontend
```
2. Instale as dependências:
```bash
yarn install
```
3. Execute o projeto:
```bash
yarn start
```
4. O sistema ficará disponível em:

```bash
http://localhost:3000
```
---
🔒 Segurança

O sistema utiliza JWT (JSON Web Token) para autenticação.
- O usuário faz login e recebe um token.
- O token deve ser enviado no cabeçalho Authorization: Bearer <token>.
- Permissões de acesso são validadas pelo backend.
- Rotas protegidas por Spring Security
- Tokens armazenados no localStorage

---
🧪 Testes

- Testes unitários no backend com JUnit
- Validações e tratamento de exceções centralizados

---
📅 Timezone

- O sistema está configurado para UTC-3 (America/Sao_Paulo) garantindo consistência de horários em reservas, check-ins e relatórios.

---
✅ Conclusão

O projeto Smart Parking IoT integra Spring Boot e React + TypeScript, aplicando boas práticas em autenticação, versionamento de banco de dados, arquitetura limpa e documentação interativa. Essa solução evidencia a aplicação prática de conceitos avançados de desenvolvimento web, como arquitetura em camadas, segurança robusta com JWT, controle de migrações via Flyway e integração eficiente entre frontend e backend. Além de atender ao propósito acadêmico, o sistema apresenta potencial de expansão para cenários reais, oferecendo maior eficiência, automação e controle na gestão de estacionamentos inteligentes. 🚀

---
👨‍💻 **Desenvolvido por:** Albert Silva de Jesus & Maury Santos – IFBA, Web Avançado  

📘 **Licença:** MIT
