
import { supabase } from '@/lib/supabase';

// Define the missing types
interface AuthResponse {
  message: string;
  user?: any;
  is_new_user?: boolean;
  verification_required?: boolean;
}

interface VerifyOtpResponse {
  message: string;
  user: {
    id?: string;
    email?: string;
    name?: string;
    phone_number?: string;
  };
}

export class AuthService {
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      return {
        message: 'Signed in successfully',
        user: data.user
      };
    } catch (error) {
      console.error("Auth service signInWithEmail error:", error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      
      return {
        message: 'Signed up successfully. Please check your email for verification.',
        user: data.user
      };
    } catch (error) {
      console.error("Auth service signUpWithEmail error:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return {
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error("Auth service signOut error:", error);
      throw error;
    }
  }

  async signInWithOtp(signInDto: { email: string }): Promise<AuthResponse> {
    try {
      // First check if user exists in the users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', signInDto.email)
        .single();

      // Send OTP
      const { data, error } = await supabase.auth.signInWithOtp({
        email: signInDto.email,
        options: {
          shouldCreateUser: true
        }
      });

      if (error) throw error;

      return {
        message: 'OTP sent to email. Please check your inbox.',
        is_new_user: !existingUser
      };
    } catch (error) {
      console.error("Auth service signInWithOtp error:", error);
      throw error;
    }
}

async verifyOtp(verifyOtpDto: { email: string; token: string; name?: string; phone_number?: string }): Promise<VerifyOtpResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: verifyOtpDto.email,
        token: verifyOtpDto.token,
        type: 'email'
      });

      if (error) throw error;

      // Check if user exists in the users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', verifyOtpDto.email)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw userError;
      }

      let result;
      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            email_verified: true,
            name: verifyOtpDto.name || existingUser.name,
            phone_number: verifyOtpDto.phone_number || existingUser.phone_number
          })
          .eq('email', verifyOtpDto.email)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedUser;
      } else {
        // Create new user profile
        if (!verifyOtpDto.name) {
          throw new Error('Name is required for new user registration');
        }

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email: verifyOtpDto.email,
            name: verifyOtpDto.name,
            email_verified: true,
            phone_number: verifyOtpDto.phone_number
          })
          .select()
          .single();

        if (insertError) throw insertError;
        result = newUser;
      }

      // Update user metadata in auth
      if (verifyOtpDto.name || verifyOtpDto.phone_number) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: verifyOtpDto.name,
            phone_number: verifyOtpDto.phone_number
          }
        });
        if (updateError) throw updateError;
      }

      return {
        message: existingUser ? 'Successfully signed in' : 'User created and verified successfully',
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          phone_number: result.phone_number
        }
      };
    } catch (error) {
      console.error("Auth service verifyOtp error:", error);
      throw error;
    }
  }

  async createUser(createUserDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
    try {
      // Use Supabase's signUp with OTP instead of the API endpoint
      const { data, error } = await supabase.auth.signInWithOtp({
        email: createUserDto.email,
        options: {
          data: {
            name: createUserDto.name,
            phone_number: createUserDto.phone_number
          }
        }
      });

      if (error) throw error;

      return {
        message: 'Please check your email for OTP verification',
        is_new_user: true,
        verification_required: true
      };
    } catch (error) {
      console.error("Auth service createUser error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create user. Please try again later.');
    }
  }
}
