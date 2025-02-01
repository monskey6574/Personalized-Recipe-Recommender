import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase, sql } from '../config/db';

export const CreateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate incoming data
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: 'Please provide all required fields.' });
            return;
        }

        const pool = await connectToDatabase();

        // Check if user already exists
        const existingUser = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (existingUser.recordset.length > 0) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await pool
        .request()
        .input('FirstName', sql.NVarChar, firstName)
        .input('LastName', sql.NVarChar, lastName)
        .input('Email', sql.NVarChar, email)
        .input('Password', sql.NVarChar, hashedPassword) // Ensure hashed password is stored correctly
        .query(`
            INSERT INTO Users (FirstName, LastName, Email, Password)
            VALUES (@FirstName, @LastName, @Email, @Password)
        `);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



//login user

export const LoginUser = async (req:Request, res:Response) : Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Validate the required fields
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
  
      // Connect to the database
      const pool = await connectToDatabase();
  
      // Query the database to find the user by email
      const result = await pool
        .request()
        .input('Email', sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE Email = @Email');
  
      if (result.recordset.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const user = result.recordset[0];
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Success: User is authenticated
      res.status(200).json({ message: 'Login successful', userId: user.UserID });
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


// Export properly for clean import
export default { CreateUser , LoginUser };
