# Testing Guide

## Backend Testing

### Setup Testing Environment

```bash
cd marketplace-backend

# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest @nestjs/testing supertest @types/supertest

# Install additional testing utilities
npm install --save-dev faker @faker-js/faker
```

### Jest Configuration

Create `jest.config.js`:
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../test'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};
```

### Unit Tests Example

**Auth Service Test** (`src/modules/auth/auth.service.spec.ts`):
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuthService } from './auth.service';
import * as bcryptjs from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user with hashed password', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'BUYER',
      };

      const hashedPassword = await bcryptjs.hash(signUpDto.password, 10);
      const createdUser = {
        id: '1',
        email: signUpDto.email,
        password: hashedPassword,
        role: signUpDto.role,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.signUp(signUpDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signUpDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
    });

    it('should throw error if user already exists', async () => {
      const signUpDto = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'BUYER',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('signIn', () => {
    it('should return auth response with token', async () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcryptjs.hash(signInDto.password, 10);
      const user = {
        id: '1',
        email: signInDto.email,
        password: hashedPassword,
        role: 'BUYER',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.signIn(signInDto);

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(expect.objectContaining({
        email: signInDto.email,
        role: 'BUYER',
      }));
    });
  });
});
```

**Cart Service Test** (`src/modules/cart/cart.service.spec.ts`):
```typescript
describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, PrismaService],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('addToCart', () => {
    it('should add product to cart', async () => {
      const userId = 'user-1';
      const productId = 'product-1';
      const quantity = 2;

      // Mock product exists and has stock
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue({
        id: productId,
        stock: 10,
        price: 100,
      } as any);

      const result = await service.addToCart(userId, {
        productId,
        quantity,
      });

      expect(result).toHaveProperty('items');
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should throw error if product out of stock', async () => {
      const userId = 'user-1';
      const productId = 'product-1';

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue({
        stock: 0,
      } as any);

      await expect(
        service.addToCart(userId, {
          productId,
          quantity: 1,
        }),
      ).rejects.toThrow('Product out of stock');
    });
  });
});
```

### Integration Tests

**Auth Controller Integration Test** (`test/auth.e2e.spec.ts`):
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should create new user and return token', async () => {
      const signUpDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        role: 'BUYER',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        email: signUpDto.email,
        role: signUpDto.role,
      });

      // Verify user created in database
      const user = await prisma.user.findUnique({
        where: { email: signUpDto.email },
      });
      expect(user).toBeDefined();
    });

    it('should return 400 if email already exists', async () => {
      const signUpDto = {
        email: 'duplicate@example.com',
        password: 'Password123!',
        role: 'BUYER',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/signin', () => {
    it('should return token for valid credentials', async () => {
      const email = 'signin@example.com';
      const password = 'Password123!';

      // Create user first
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email, password, role: 'BUYER' });

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email, password })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });
});
```

### Run Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:cov

# Run specific test file
npm run test -- auth.service.spec.ts

# Run integration tests only
npm run test:e2e
```

## Frontend Testing

### Setup Testing Environment

```bash
cd marketplace-frontend

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest @types/jest jest-environment-jsdom

# Install mocking libraries
npm install --save-dev msw vitest
```

### Jest Configuration for Next.js

Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

### Component Test Example

**Header Component Test** (`src/components/__tests__/Header.spec.tsx`):
```typescript
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';
import { useAuthStore } from '@/lib/stores';

jest.mock('@/lib/stores');

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display login link when not authenticated', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('should display logout button when authenticated', () => {
    const mockLogout = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com' },
      logout: mockLogout,
    });

    render(<Header />);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should display cart count', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<Header />);

    const cartBadge = screen.getByTestId('cart-count');
    expect(cartBadge).toBeInTheDocument();
  });
});
```

### API Client Mock

Create `src/lib/__mocks__/api-client.ts`:
```typescript
export const mockApiClient = {
  auth: {
    signup: jest.fn(),
    signin: jest.fn(),
  },
  vendors: {
    createVendor: jest.fn(),
    getVendor: jest.fn(),
    getNearbyVendors: jest.fn(),
  },
  products: {
    createProduct: jest.fn(),
    searchProducts: jest.fn(),
  },
  cart: {
    getCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  },
  orders: {
    createCheckout: jest.fn(),
    selectPaymentMethod: jest.fn(),
    confirmPayment: jest.fn(),
  },
};
```

### Run Frontend Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:cov

# Run specific test file
npm run test Header.spec.tsx
```

## E2E Testing (Cypress)

### Setup Cypress

```bash
cd marketplace-frontend

npm install --save-dev cypress

# Open Cypress Test Runner
npx cypress open
```

### E2E Test Example

Create `cypress/e2e/checkout.cy.ts`:
```typescript
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('buyer@example.com', 'password123');
  });

  it('should complete checkout flow', () => {
    // Search and add product
    cy.get('[data-testid="search-input"]').type('laptop');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('button[aria-label="Add to cart"]').click();
    cy.get('[data-testid="cart-notification"]').should('be.visible');

    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');

    // Checkout
    cy.get('button:contains("Checkout")').click();
    cy.url().should('include', '/checkout');

    // Select payment method
    cy.get('input[value="CARD"]').check();
    cy.get('button:contains("Continue to Payment")').click();

    // Handle Stripe popup (in test mode, just confirm)
    cy.get('[data-testid="payment-confirmation"]').should('be.visible');
    cy.get('button:contains("Confirm Payment")').click();

    // Verify success
    cy.url().should('include', '/order');
    cy.get('[data-testid="order-confirmation"]').should('be.visible');
  });

  it('should show error for invalid payment method', () => {
    cy.get('[data-testid="search-input"]').type('product');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('button[aria-label="Add to cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('button:contains("Checkout")').click();

    // Select CARD without entering details
    cy.get('input[value="CARD"]').check();
    cy.get('button:contains("Continue to Payment")').click();

    // Should show validation error
    cy.get('[data-testid="payment-error"]').should('contain', 'Please enter card details');
  });
});
```

### Custom Cypress Commands

Create `cypress/support/commands.ts`:
```typescript
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('addProductToCart', (productName: string) => {
  cy.get('[data-testid="search-input"]').type(productName);
  cy.get('[data-testid="product-card"]').first().click();
  cy.get('button[aria-label="Add to cart"]').click();
  cy.get('[data-testid="cart-notification"]').should('be.visible');
});
```

### Run E2E Tests

```bash
# Interactive mode
npx cypress open

# Headless mode
npx cypress run

# Run specific test
npx cypress run --spec "cypress/e2e/checkout.cy.ts"
```

## Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Auth Service | 90%+ |
| Cart Service | 85%+ |
| Order Service | 90%+ |
| Product Service | 85%+ |
| API Client | 80%+ |
| Components | 75%+ |
| **Overall** | **85%+** |

## Continuous Integration

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: marketplace_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: marketplace-backend/package-lock.json

      - name: Install dependencies
        working-directory: marketplace-backend
        run: npm ci

      - name: Setup database
        working-directory: marketplace-backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/marketplace_test
        run: npm run prisma:migrate

      - name: Run tests
        working-directory: marketplace-backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/marketplace_test
        run: npm run test:cov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: marketplace-backend/coverage

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: marketplace-frontend/package-lock.json

      - name: Install dependencies
        working-directory: marketplace-frontend
        run: npm ci

      - name: Run tests
        working-directory: marketplace-frontend
        run: npm run test:cov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: marketplace-frontend/coverage
```

## Testing Best Practices

1. **Write tests before or alongside code** (TDD approach)
2. **Test behavior, not implementation**
3. **Keep tests independent** (no shared state between tests)
4. **Use meaningful test descriptions**
5. **Mock external dependencies** (APIs, databases)
6. **Aim for high coverage** (85%+ of critical paths)
7. **Test edge cases** (empty states, errors, limits)
8. **Use factory functions** for test data setup
9. **Clean up after tests** (reset mocks, clear data)
10. **Run tests in CI/CD pipeline** before deployment

## Performance Testing

### Load Testing with k6

```bash
npm install -g k6
```

Create `load-test.js`:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // ramp-up
    { duration: '5m', target: 100 },  // stay at 100
    { duration: '2m', target: 0 },    // ramp-down
  ],
};

export default function () {
  let res = http.get('http://localhost:3001/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

```bash
# Run load test
k6 run load-test.js
```

## Security Testing

### OWASP ZAP Scanning

```bash
# Docker-based OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Check results
# Focus on: SQL injection, XSS, CSRF, broken auth
```

## Debugging Tests

```bash
# Debug backend tests
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Debug frontend tests
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Chrome DevTools: chrome://inspect
```
