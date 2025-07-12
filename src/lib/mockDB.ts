// Simple in-memory database for development
// This is a temporary solution to get the app running without MongoDB

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  pointsBalance: number;
  sustainabilityScore: number;
  ecoLevel: string;
  totalSwaps: number;
  totalItemsListed: number;
  carbonSaved: number;
}

// In-memory user storage
const users: User[] = [
  {
    id: '1',
    email: 'demo@rewear.com',
    username: 'demo_user',
    password: '$2a$12$demo.hashed.password.example', // This would be hashed 'demo123'
    pointsBalance: 150,
    sustainabilityScore: 75,
    ecoLevel: 'Silver',
    totalSwaps: 5,
    totalItemsListed: 8,
    carbonSaved: 12.5,
  },
  {
    id: '2',
    email: 'user@example.com',
    username: 'test_user',
    password: '$2a$12$test.hashed.password.example', // This would be hashed 'password123'
    pointsBalance: 200,
    sustainabilityScore: 90,
    ecoLevel: 'Gold',
    totalSwaps: 12,
    totalItemsListed: 15,
    carbonSaved: 25.0,
  }
];

export const mockDB = {
  findUserByEmail: (email: string): User | null => {
    return users.find(user => user.email === email) || null;
  },
  
  findUserByUsername: (username: string): User | null => {
    return users.find(user => user.username === username) || null;
  },
  
  createUser: (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },
  
  getAllUsers: (): User[] => {
    return users;
  }
};

// Simple password validation for demo
export const validatePassword = (inputPassword: string, storedPassword: string): boolean => {
  // For demo purposes, we'll use simple comparison
  // In real app, this would use bcrypt.compare()
  if (storedPassword.includes('demo') && inputPassword === 'demo123') return true;
  if (storedPassword.includes('test') && inputPassword === 'password123') return true;
  return false;
};
