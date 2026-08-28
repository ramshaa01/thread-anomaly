import { getAdminUser, getUser } from '@/lib/auth';
import jwt from 'jsonwebtoken';

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn()
}));

// Mock db
jest.mock('@/lib/db', () => jest.fn());

// Mock User model
jest.mock('@/lib/models/User', () => ({
  findById: jest.fn()
}));

describe('Auth Middleware', () => {
  it('should return null if no token is present', async () => {
    const { cookies } = require('next/headers');
    cookies.mockResolvedValue({ get: () => undefined });
    
    const user = await getUser();
    expect(user).toBeNull();
  });

  it('should block non-admin users from admin routes', async () => {
    const { cookies } = require('next/headers');
    cookies.mockResolvedValue({ get: () => ({ value: 'fake_token' }) });
    
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' }));
    
    const User = require('@/lib/models/User');
    // Mock customer user
    User.findById.mockResolvedValue({ _id: '123', role: 'customer' });
    
    const admin = await getAdminUser();
    expect(admin).toBeNull();
  });

  it('should allow admin users on admin routes', async () => {
    const { cookies } = require('next/headers');
    cookies.mockResolvedValue({ get: () => ({ value: 'fake_token' }) });
    
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' }));
    
    const User = require('@/lib/models/User');
    // Mock admin user
    User.findById.mockResolvedValue({ _id: '123', role: 'admin' });
    
    const admin = await getAdminUser();
    expect(admin).not.toBeNull();
    expect(admin!.role).toBe('admin');
  });
});
