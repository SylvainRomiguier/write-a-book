# Hexagonal Architecture Project

A TypeScript implementation demonstrating **Hexagonal Architecture** (also known as **Ports and Adapters**) with clean separation of concerns and strict dependency management using Dependency Cruiser.

## 🏗️ Architecture Overview

This project follows the **Hexagonal Architecture** pattern, which promotes:

- **Business logic isolation**: The domain layer contains pure business logic with no external dependencies
- **Dependency inversion**: High-level modules don't depend on low-level modules; both depend on abstractions
- **Port and Adapter pattern**: Well-defined interfaces (ports) with specific implementations (adapters)
- **Testability**: Easy to test business logic in isolation with mock implementations

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                      API Layer                          │
│                   (Primary Adapters)                    │
│              HTTP Controllers, CLI, etc.                │
└─────────────────────┬───────────────────────────────────┘
┌─────────────────────▼───────────────────────────────────┐
│                  Domain Layer                           │
│          Business Logic & Use Cases                     │
│     Entities, Value Objects, Domain Services            │
│              Ports (Interfaces)                         │
└─────────────────────▲───────────────────────────────────┘
┌─────────────────────┴───────────────────────────────────┐
│                   SPI Layer                             │
│                (Secondary Adapters)                     │
│        Database, External APIs, File System             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Core Layer                            │
│            Dependency Injection Container               │
│              Application Bootstrapping                  │
└─────────────────────────────────────────────────────────┘

```

## 📁 Project Structure

```
src/
├── api/                          # Primary Adapters (API Layer)
│   ├── UserController.fastify.ts  # HTTP REST controller
│   ├── UserPresenter.json.ts      # JSON presenter for single user
│   ├── UsersPresenter.json.ts     # JSON presenter for multiple users
│   └── __tests__/
│       └── postUser.curl.sh       # API testing script
├── core/                         # Application Core
│   ├── dependenciesInjection.ts   # Dependency injection container
│   └── main.ts                    # Application entry point
├── domain/                       # Business Logic (Domain Layer)
│   ├── Email.ts                   # Email value object
│   ├── Id.ts                      # ID value object
│   ├── Name.ts                    # Name value object
│   ├── User.ts                    # User entity
│   ├── User.UseCases.ts           # User use cases implementation
│   ├── UserNotFoundError.ts       # Domain-specific error
│   ├── ValueObject.ts             # Base value object class
│   ├── presenters/                # Output ports (interfaces)
│   │   ├── UserPresenter.ts       # Single user presentation interface
│   │   └── UsersPresenter.ts      # Multiple users presentation interface
│   ├── services/                  # Domain services ports
│   │   ├── UserService.ts         # User persistence interface
│   │   └── UuidService.ts         # UUID generation interface
│   └── __tests__/                 # Domain tests
│       ├── User.UseCases.spec.ts  # Use cases unit tests
│       ├── UserService.inMemory.ts # In-memory test implementation
│       ├── UsersPresenter.json.ts  # Test presenter
│       └── UuidService.Mock.ts     # Mock UUID service
└── spi/                          # Secondary Adapters (SPI Layer)
    ├── UserService.sqlite.ts      # SQLite user repository
    └── UuidService.node.ts        # Node.js UUID implementation
```

### Layer Responsibilities

#### 🔌 API Layer (`src/api/`)

- **Primary Adapters**: Convert external requests into domain operations
- **Responsibilities**:
  - HTTP request/response handling
  - Input validation and sanitization
  - Error handling and HTTP status codes
  - Data serialization/deserialization
- **Dependencies**: Can depend on Domain layer only

#### ⚙️ Core Layer (`src/core/`)

- **Application Bootstrap**: Wires everything together
- **Responsibilities**:
  - Dependency injection setup
  - Application configuration
  - Service registration and lifecycle management
- **Dependencies**: Can depend on all layers for assembly

#### 🧠 Domain Layer (`src/domain/`)

- **Business Logic**: Pure domain logic with no external dependencies
- **Responsibilities**:
  - Business rules and domain logic
  - Use cases orchestration
  - Domain entities and value objects
  - Domain services interfaces (ports)
- **Dependencies**: **NONE** - Completely isolated

#### 🔧 SPI Layer (`src/spi/`)

- **Secondary Adapters**: Implement domain interfaces with external concerns
- **Responsibilities**:
  - Database operations
  - External API calls
  - File system operations
  - Third-party service integrations
- **Dependencies**: Can depend on Domain layer only

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Start the application
pnpm start

# Development mode (with rebuild)
pnpm dev
```

### API Endpoints

The application provides REST endpoints for user management:

```bash
# Create a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get a specific user
curl http://localhost:3000/users/{id}

# Get all users
curl http://localhost:3000/users
```

## 🔒 Dependency Management with Dependency Cruiser

This project uses [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) to enforce architectural boundaries and prevent dependency violations.

### Architecture Rules Enforced

#### 1. **Domain Isolation**

```javascript
{
  name: "domain-to-other-than-domain",
  severity: "error",
  from: { path: "^src/domain/" },
  to: { pathNot: "^src/domain/" }
}
```

- **Rule**: Domain layer cannot import from any other layer
- **Purpose**: Ensures business logic remains pure and testable
- **Violation Example**: Domain importing from API or SPI layers

#### 2. **API-SPI Separation**

```javascript
{
  name: "api-to-spi",
  severity: "error",
  from: { path: "^src/api/" },
  to: { path: "^src/spi/" }
}
```

- **Rule**: API layer cannot directly import from SPI layer
- **Purpose**: Prevents tight coupling between input and output adapters
- **Solution**: Use dependency injection through the Core layer

#### 3. **SPI-API Separation**

```javascript
{
  name: "spi-to-api",
  severity: "error",
  from: { path: "^src/spi/" },
  to: { path: "^src/api/" }
}
```

- **Rule**: SPI layer cannot import from API layer
- **Purpose**: Maintains unidirectional data flow

### Running Dependency Validation

```bash
# Validate dependencies (included in build process)
pnpm depcruise:validate

# Generate dependency graph visualization
pnpm depcruise:tree
```

### Common Violations and Solutions

#### ❌ **Domain importing external dependencies**

```typescript
// ❌ WRONG: Domain importing from SPI
import { UserServiceSqlite } from '../spi/UserService.sqlite';

// ✅ CORRECT: Domain defining interface
export interface UserService {
  saveUser(user: UserDto): Promise<void>;
}
```

#### ❌ **API directly depending on SPI**

```typescript
// ❌ WRONG: API importing SPI directly
import { UserServiceSqlite } from "../spi/UserService.sqlite";

// ✅ CORRECT: API receiving dependencies via injection
constructor(private userUseCases: UserUseCases) {}
```

#### ❌ **Circular dependencies**

```typescript
// ❌ WRONG: Circular reference
// UserService imports User, User imports UserService

// ✅ CORRECT: Use DTOs or extract shared interfaces
export interface UserDto {
  id: string;
  name: string;
  email: string;
}
```

## 🧪 Testing Strategy

### Unit Testing

- **Domain tests**: Test business logic in isolation with mocks
- **Use case tests**: Verify orchestration logic
- **Value object tests**: Ensure invariants are maintained

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

### Test Structure

```
domain/__tests__/
├── User.UseCases.spec.ts      # Business logic tests
├── UserService.inMemory.ts    # In-memory test double
├── UuidService.Mock.ts        # Mock service
└── UsersPresenter.json.ts     # Test presenter
```

## 🛠️ Development Guidelines

### Adding New Features

1. **Start with Domain**: Define entities, value objects, and use cases
2. **Define Ports**: Create interfaces for external dependencies
3. **Implement Adapters**: Create concrete implementations in API/SPI layers
4. **Wire Dependencies**: Update dependency injection in Core layer
5. **Validate Architecture**: Run `pnpm depcruise:validate`

### Domain Layer Rules

- ✅ **Pure functions and classes**
- ✅ **Value objects for primitive types**
- ✅ **Rich domain models with behavior**
- ✅ **Domain-specific exceptions**
- ❌ **No external library imports**
- ❌ **No infrastructure concerns**
- ❌ **No framework dependencies**

### Testing Best Practices

- **Test behavior, not implementation**
- **Use in-memory adapters for fast tests**
- **Mock external dependencies**
- **Write integration tests for critical paths**

## 📊 Monitoring and Visualization

### Dependency Graph

Generate a visual representation of your dependencies:

```bash
pnpm depcruise:tree
```

This creates `dependency-graph.svg` showing:

- Module relationships
- Layer boundaries
- Potential architectural violations

### Build Integration

The build process (`pnpm build`) automatically:

1. Validates architectural rules
2. Compiles TypeScript
3. Fails fast on violations

## 🔧 Configuration Files

- **`.dependency-cruiser.js`**: Architectural rules and validation
- **`tsconfig.json`**: TypeScript compilation settings
- **`package.json`**: Build scripts and dependencies

## 📚 Further Reading

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Cruiser Documentation](https://github.com/sverweij/dependency-cruiser)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

This project demonstrates how to build maintainable, testable applications with clear architectural boundaries and automated dependency validation.
