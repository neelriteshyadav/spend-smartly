import mongoose from 'mongoose';
import User from '../models/User';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save user successfully', async () => {
    const validUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      categories: [{ label: 'Food', icon: '🍔' }]
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ firstName: 'John' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
}); 