// src/scripts/login.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // ?? https://w.bankon.click
const EMAIL = 'admin@michael.com';
const PASSWORD = 'Amir@123';

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: EMAIL,
      password: PASSWORD,
    });

    const { accessToken, user } = response.data;

    console.log('? Login successful!');
    console.log('?? Access Token:');
    console.log(accessToken);
    console.log('?? User:', user.username, '|', user.email);
    console.log('\n?? Copy this token for Authorization header:');
    console.log(`Bearer ${accessToken}`);

  } catch (error: any) {
    if (error.response) {
      console.error('? Login failed:', error.response.data);
    } else {
      console.error('? Network error:', error.message);
    }
  }
}

if (require.main === module) {
  login();
}