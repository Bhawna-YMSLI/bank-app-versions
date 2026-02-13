import fs from 'node:fs';

const bankApi = fs.readFileSync('src/app/core/bank-api.service.ts', 'utf8');
const authApi = fs.readFileSync('src/app/core/auth.service.ts', 'utf8');

const checks = [
  { endpoint: '/auth/login', source: authApi, sourceName: 'AuthService' },
  { endpoint: '/accounts', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/accounts/${accountNumber}', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/users/clerk', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/users/clerks', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/users/clerks/${username}/disable', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/deposit', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/withdraw', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/account/${accountNumber}/history', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/${transactionId}', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/${transactionId}/approve', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/${transactionId}/reject', source: bankApi, sourceName: 'BankApiService' },
  { endpoint: '/transactions/pending', source: bankApi, sourceName: 'BankApiService' }
];

const missing = checks.filter((item) => !item.source.includes(item.endpoint));

if (missing.length > 0) {
  console.error('Missing endpoint mappings:');
  for (const item of missing) {
    console.error(` - ${item.endpoint} not found in ${item.sourceName}`);
  }
  process.exit(1);
}

console.log('All expected backend endpoint mappings are present in frontend services.');
