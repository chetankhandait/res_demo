# Backend API cURL Tests

Run these commands in your terminal (Git Bash, WSL, or Command Prompt if curl is installed).

## 1. Get All Menu Items
```bash
curl -X GET http://localhost:5000/api/menu
```

## 2. Get Tables
```bash
curl -X GET http://localhost:5000/api/tables
```

## 3. Calculate Order Total
```bash
curl -X POST http://localhost:5000/api/orders/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "menu_item_id": "M-001", "quantity": 2 },
      { "menu_item_id": "M-021", "quantity": 1 }
    ]
  }'
```

## 4. Create an Order
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "table_id": "T-001",
    "total_amount": 590.00,
    "payment_id": "pay_dummy123",
    "items": [
      { "menu_item_id": "M-001", "quantity": 2 },
      { "menu_item_id": "M-021", "quantity": 1 }
    ]
  }'
```

## 5. Get Kitchen Queue (South Indian)
```bash
curl -X GET http://localhost:5000/api/kitchen/queue/S-001
```

## 6. Get Analytics (Today)
```bash
curl -X GET http://localhost:5000/api/analytics/today
```

## 7. Get Active Orders (Manager)
```bash
curl -X GET http://localhost:5000/api/orders/active
```
