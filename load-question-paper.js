import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
};

const BASE_URL = 'https://apiabacus.deveraa.com';

export default function () {
  // const res = http.get(`${BASE_URL}/results/check?user_id=73&exam_id=2`);
  //  const res = http.get(`${BASE_URL}/questions/level-wise-sets?level=0&createdby=50`);
  // const res = http.get(`${BASE_URL}/exam-schedule/studentexam?level=0&createdby=50`);
   const res = http.get(`${BASE_URL}/questions/paperset?level=1&createdby=1&set=A`);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}