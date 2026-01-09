const { calculatePriority } = require('./services/priorityCalculator');

// Mock Data
const mockTable = { capacity: 4 };
const mockMenuItem = { base_prep_time: 10 }; // 10 mins prep

// Scenario 1: Time Impact
// Order A: Just now, Value 100
const orderA = { createdAt: new Date(), total_amount: 100 };
// Order B: 30 minutes ago, Value 100
const orderB = { createdAt: new Date(Date.now() - 30 * 60000), total_amount: 100 };

// Scenario 2: Value Impact
// Order C: Just now, Value 500 (High Value)
const orderC = { createdAt: new Date(), total_amount: 500 };

console.log('--- Verification of Priority Algorithm ---');

const scoreA = calculatePriority({}, orderA, mockMenuItem, mockTable);
console.log(`Order A (New, $100): Priority Score = ${scoreA}`);

const scoreB = calculatePriority({}, orderB, mockMenuItem, mockTable);
console.log(`Order B (Old-30m, $100): Priority Score = ${scoreB}`);

const scoreC = calculatePriority({}, orderC, mockMenuItem, mockTable);
console.log(`Order C (New, $500): Priority Score = ${scoreC}`);

console.log('\n--- Results ---');
if (scoreB > scoreA) {
    console.log('✅ PASS: Older orders have higher priority.');
} else {
    console.log('❌ FAIL: Time did not increase priority.');
}

if (scoreC > scoreA) {
    console.log('✅ PASS: Higher value orders have higher priority.');
} else {
    console.log('❌ FAIL: Value did not increase priority.');
}
