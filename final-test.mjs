async function testAPI() {
  console.log('Testing x402-Gated Storacha API...\n');
  
  const baseUrl = 'http://localhost:3002';
  
  // Test if server is running
  console.log('0. Checking if server is running...');
  try {
    const response = await fetch(`${baseUrl}/api/upload`, { method: 'GET' });
    console.log('Server status:', response.status);
  } catch (error) {
    console.log('❌ Server not running! Start with: npm run dev');
    return;
  }
  
  // Test upload without payment
  console.log('\n1. Testing upload without payment:');
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');
    
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData
    });
    console.log('Status:', response.status);
    console.log('Payment headers:', {
      required: response.headers.get('X-Payment-Required'),
      price: response.headers.get('X-Price'),
      address: response.headers.get('X-Payment-Address'),
      network: response.headers.get('X-Network')
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  console.log('\n2. Testing retrieve without payment:');
  try {
    const response = await fetch(`${baseUrl}/api/retrieve?cid=test123`);
    console.log('Status:', response.status);
    console.log('Payment headers:', {
      required: response.headers.get('X-Payment-Required'),
      price: response.headers.get('X-Price')
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  console.log('\n3. Testing with mock payment:');
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test content with payment'], { type: 'text/plain' }), 'paid-test.txt');
    
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'x402-payment': 'tx:mock-payment-hash'
      }
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  console.log('\n✅ Test complete!');
}

testAPI();