// Quick test để xem API có trả về data đúng không
fetch('http://localhost:3000/api/daily')
  .then(res => res.json())
  .then(data => {
    console.log('=== API RESPONSE ===');
    console.log('Success:', data.success);
    console.log('Data:', data.data);
    console.log('Groups count:', data.data?.groups?.length);
    console.log('First group:', data.data?.groups?.[0]);
    console.log('===================');
  })
  .catch(err => console.error('API Error:', err));
