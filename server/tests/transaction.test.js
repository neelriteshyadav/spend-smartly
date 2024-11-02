import { index, create, update, destroy } from '../controller/TransactionController';

describe('Transaction Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      user: { _id: 'mockUserId' },
      body: {},
      params: {}
    };
    mockRes = {
      json: jest.fn()
    };
  });

  test('index should return aggregated transactions', async () => {
    await index(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockRes.json.mock.calls[0][0]).toHaveProperty('data');
  });

  test('create should save new transaction', async () => {
    mockReq.body = {
      amount: 100,
      description: 'Test',
      date: new Date(),
      category_id: 'categoryId'
    };
    await create(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Success' });
  });
}); 