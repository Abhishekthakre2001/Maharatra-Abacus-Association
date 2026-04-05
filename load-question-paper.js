import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE_URL}/questions/paperset?level=1&createdby=1&set=A`);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}