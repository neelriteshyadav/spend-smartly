import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function() {
  const res = http.get('http://localhost:3000/transaction');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'transaction list loads < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
} 