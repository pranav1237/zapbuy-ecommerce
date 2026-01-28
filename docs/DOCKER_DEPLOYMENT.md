# Docker & Deployment Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Setup Steps

1. **Copy environment variables:**
```bash
cp .env.example .env
```

2. **Update .env with your credentials:**
```env
# Update Stripe keys
STRIPE_SECRET_KEY=sk_test_your_actual_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key

# Update Mapbox token
NEXT_PUBLIC_MAPBOX_TOKEN=pk_your_actual_token
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Initialize database (first time only):**
```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation (Swagger): http://localhost:3001/api/docs
- PostgreSQL: localhost:5432

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services

```bash
docker-compose down

# Include volume cleanup (removes database)
docker-compose down -v
```

## Building Docker Images Manually

### Backend Image

```bash
cd marketplace-backend

# Build
docker build -t marketplace-backend:latest .

# Run with environment variables
docker run -d \
  --name marketplace-backend \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  -e STRIPE_SECRET_KEY="sk_test_..." \
  marketplace-backend:latest
```

### Frontend Image

```bash
cd marketplace-frontend

# Build (requires NODE_ENV)
docker build -t marketplace-frontend:latest .

# Run
docker run -d \
  --name marketplace-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
  marketplace-frontend:latest
```

## Production Deployment

### AWS ECS (Elastic Container Service)

#### 1. Push Images to ECR

```bash
# Create ECR repositories
aws ecr create-repository --repository-name marketplace-backend --region us-east-1
aws ecr create-repository --repository-name marketplace-frontend --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-backend:latest marketplace-backend
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-backend:latest

# Build and push frontend
docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-frontend:latest marketplace-frontend
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-frontend:latest
```

#### 2. Create ECS Task Definition

**Backend Task Definition** (`backend-task-definition.json`):
```json
{
  "family": "marketplace-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "marketplace-backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:password@marketplace-db.xxx.rds.amazonaws.com:5432/marketplace_db"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:marketplace/jwt-secret"
        },
        {
          "name": "STRIPE_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:marketplace/stripe-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/marketplace-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskRole"
}
```

#### 3. Create ECS Service

```bash
aws ecs create-service \
  --cluster marketplace-cluster \
  --service-name marketplace-backend \
  --task-definition marketplace-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=marketplace-backend,containerPort=3001 \
  --region us-east-1
```

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd marketplace-frontend
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
```

### Database - AWS RDS

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier marketplace-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username marketplace_user \
  --master-user-password "strong-password-here" \
  --allocated-storage 20 \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name default \
  --enable-cloudwatch-logs-exports postgresql \
  --multi-az \
  --backup-retention-period 30

# Run migrations
DATABASE_URL="postgresql://marketplace_user:password@marketplace-db.xxx.rds.amazonaws.com:5432/marketplace_db" \
npm run prisma:migrate -- --name "prod-init"
```

## Monitoring & Logging

### CloudWatch Logs (AWS)

```bash
# View logs
aws logs tail /ecs/marketplace-backend --follow

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name marketplace-backend-cpu \
  --alarm-description "Alert if CPU usage is high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Application Monitoring

**New Relic Integration** (optional):
```bash
# Add to backend Dockerfile
RUN npm install newrelic

# Create newrelic.js configuration
# Add to main.ts before app initialization
require('newrelic');
```

**Sentry Integration** (error tracking):
```bash
# Backend
npm install @sentry/node @sentry/tracing

# Frontend
npm install @sentry/nextjs
```

## Health Checks

### Backend Health Endpoint

```typescript
// Add to main.ts
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Test Health
```bash
curl http://localhost:3001/health
```

## Rolling Updates

### Update Backend Image

```bash
# Build new image
docker build -t marketplace-backend:v1.1.0 marketplace-backend

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/marketplace-backend:v1.1.0

# Update service (ECS will perform rolling update)
aws ecs update-service \
  --cluster marketplace-cluster \
  --service marketplace-backend \
  --force-new-deployment
```

### Zero-Downtime Database Migrations

```bash
# 1. Create migration
npm run prisma:migrate -- --name "feature-xyz"

# 2. Deploy backend with new migration
docker build -t marketplace-backend:v1.1.0 .

# 3. Run migration on new container
docker-compose exec backend npm run prisma:migrate deploy

# 4. Update ECS task definition with new image
# 5. Update service (rolling update maintains availability)
```

## Troubleshooting

### Database Connection Issues

```bash
# Check connection string
docker-compose exec backend npm run prisma:status

# Test database
psql -h localhost -U marketplace_user -d marketplace_db

# View migration status
docker-compose exec backend npx prisma migrate status
```

### Memory Leaks

```bash
# Monitor memory
docker stats marketplace-backend

# Generate heap dump
docker-compose exec backend node --inspect=0.0.0.0:9229 npm run start:prod

# Use Chrome DevTools to analyze
# chrome://inspect
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3001
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3002:3001"  # Change to 3002 instead of 3001
```

## Backup & Recovery

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U marketplace_user marketplace_db > backup.sql

# Restore from backup
docker-compose exec postgres psql -U marketplace_user marketplace_db < backup.sql

# AWS RDS Backup
aws rds create-db-snapshot \
  --db-instance-identifier marketplace-db \
  --db-snapshot-identifier marketplace-db-backup-2024-01-15
```

### Volume Backup

```bash
# Backup postgres_data volume
docker run --rm -v marketplace_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore volume
docker run --rm -v marketplace_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

## Performance Optimization

### Frontend Image Optimization

```dockerfile
# marketplace-frontend/Dockerfile
FROM node:18-alpine AS builder
...
RUN npm run build
# This generates optimized production build with:
# - Code splitting
# - Image optimization
# - CSS minification
# - JavaScript minification

FROM node:18-alpine
...
COPY --from=builder /app/.next ./.next  # Only copy optimized build
```

### Backend Load Balancing

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3  # Run 3 instances
  
  nginx:  # Add reverse proxy
    image: nginx:alpine
    ports:
      - "3001:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
```

## Security Best Practices

1. **Use Secrets Management**
   - AWS Secrets Manager for production
   - Never commit .env with real values

2. **Network Security**
   - Use private subnets for backend/database
   - Enable VPC security groups
   - Use security group rules to allow only necessary traffic

3. **Image Security**
   - Scan images for vulnerabilities
   ```bash
   docker scan marketplace-backend:latest
   ```
   - Use minimal base images (alpine)
   - Run as non-root user (implemented in Dockerfile)

4. **Environment Variables**
   - Never log sensitive variables
   - Rotate credentials regularly
   - Use AWS Secrets Manager for production

5. **Container Registry**
   - Enable ECR image scanning
   - Use private ECR repositories
   - Implement image retention policies

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/best_practices.html)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [PostgreSQL Backup & Recovery](https://www.postgresql.org/docs/current/backup.html)
