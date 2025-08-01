// Mock Supabase client for development without real keys
interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    display_name?: string;
  };
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

class MockSupabaseAuth {
  private currentUser: MockUser | null = null;
  private listeners: Array<(event: string, session: MockSession | null) => void> = [];

  // Mock users database
  private users = [
    { 
      email: 'admin@yargi.gov.tr', 
      password: 'admin123', 
      id: '1', 
      user_metadata: { full_name: 'Admin User', display_name: 'Admin' } 
    },
    { 
      email: 'test@test.com', 
      password: '123456', 
      id: '2', 
      user_metadata: { full_name: 'Test User', display_name: 'Test' } 
    },
    { 
      email: 'hikmet@test.com', 
      password: 'password', 
      id: '3', 
      user_metadata: { full_name: 'Hikmet Tanrıverdi', display_name: 'Hikmet' } 
    }
  ];

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid email or password' }
      };
    }

    const mockUser: MockUser = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };

    const mockSession: MockSession = {
      user: mockUser,
      access_token: 'mock-jwt-token'
    };

    this.currentUser = mockUser;
    
    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', mockSession));

    return {
      data: { user: mockUser, session: mockSession },
      error: null
    };
  }

  async signUp({ 
    email, 
    password, 
    options 
  }: { 
    email: string; 
    password: string; 
    options?: { data?: { full_name?: string; display_name?: string } } 
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return {
        data: { user: null, session: null },
        error: { message: 'User already exists' }
      };
    }

    const newUser = {
      id: String(this.users.length + 1),
      email,
      password,
      user_metadata: options?.data || {}
    };

    this.users.push(newUser);

    const mockUser: MockUser = {
      id: newUser.id,
      email: newUser.email,
      user_metadata: newUser.user_metadata
    };

    return {
      data: { user: mockUser, session: null }, // No auto-login for signup
      error: null
    };
  }

  async signOut() {
    this.currentUser = null;
    this.listeners.forEach(listener => listener('SIGNED_OUT', null));
    return { error: null };
  }

  async getSession() {
    if (this.currentUser) {
      const mockSession: MockSession = {
        user: this.currentUser,
        access_token: 'mock-jwt-token'
      };
      return { data: { session: mockSession }, error: null };
    }
    return { data: { session: null }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
    this.listeners.push(callback);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }
}

class MockSupabaseClient {
  auth = new MockSupabaseAuth();
}

export const supabase = new MockSupabaseClient();