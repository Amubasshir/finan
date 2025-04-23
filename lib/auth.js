import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * Verifies the JWT token from the request
 * @param {Request} request - The incoming request object
 * @returns {string|null} - The user ID if token is valid, null otherwise
 */
export async function verifyToken(request) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.substring(7);
    } else {
      // If no Authorization header, try to get from cookies
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Return the user ID from the decoded token
    return decoded?.userId||decoded?._id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
export async function verifyAdminToken(request) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.substring(7);
    } else {
      // If no Authorization header, try to get from cookies
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log(decoded);
    
    // Return the user ID from the decoded token
    return decoded?.role=="admin"?decoded?.userId||decoded?._id:null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Gets the user role from the token
 * @param {Request} request - The incoming request object
 * @returns {string|null} - The user role if token is valid, null otherwise
 */
export async function getUserRole(request) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from Authorization header
      token = authHeader.substring(7);
    } else {
      // If no Authorization header, try to get from cookies
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Return the user role from the decoded token
    return decoded.role;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}