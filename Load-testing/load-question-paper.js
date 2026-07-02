import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

const BASE_URL = 'https://core.vvmstage.cloud';

export default function () {

   const res = http.get(`${BASE_URL}/api/news`);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}