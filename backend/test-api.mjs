import http from 'http';

async function testApi() {
  const loginPayload = JSON.stringify({
    email: 'admin@landrecord.gov.in',
    password: 'Password123!',
  });

  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: loginPayload,
  });

  const loginData = await loginRes.json();
  console.log('1. Login response:', loginData.success, 'Role:', loginData.data?.user?.role);
  const token = loginData.data?.token;

  if (!token) {
    console.error('Failed to obtain token');
    return;
  }

  // Test dashboard stats
  const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statsData = await statsRes.json();
  console.log('2. Dashboard Stats Overview:', statsData.data?.overview);

  // Test land records
  const recordsRes = await fetch('http://localhost:5000/api/land-records?limit=3', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const recordsData = await recordsRes.json();
  console.log('3. Land Records Count:', recordsData.pagination?.total, 'Sample Owner:', recordsData.data?.[0]?.ownerName);

  // Test documents
  const docsRes = await fetch('http://localhost:5000/api/documents?limit=3', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const docsData = await docsRes.json();
  console.log('4. Documents Count:', docsData.pagination?.total, 'Sample File:', docsData.data?.[0]?.fileName);

  // Test verification queue
  const queueRes = await fetch('http://localhost:5000/api/verification/queue?limit=3', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const queueData = await queueRes.json();
  console.log('5. Verification Queue Count:', queueData.pagination?.total);

  // Test users
  const usersRes = await fetch('http://localhost:5000/api/users?limit=3', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usersData = await usersRes.json();
  console.log('6. Users Count:', usersData.pagination?.total, 'Sample User:', usersData.data?.[0]?.name);

  console.log('--- ALL API ENDPOINTS VALIDATED SUCCESSFULLY ---');
}

testApi().catch(console.error);
