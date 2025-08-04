// pages/api/auth/login.ts - API route (if using API routes)
import { NextApiRequest, NextApiResponse } from 'next';
import apiClient from '../../../libs/axios'; // ✅ Correct


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, expiresInMins } = req.body;
    
    const response = await apiClient.post('/auth/login', {
      username,
      password,
      expiresInMins: expiresInMins || 60,
    });

    // Set httpOnly cookie for better security
    res.setHeader('Set-Cookie', [
      `accessToken=${response.data.token}; HttpOnly; Path=/; Max-Age=${(expiresInMins || 60) * 60}; SameSite=Strict; Secure`,
    ]);

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
    });
  }
}