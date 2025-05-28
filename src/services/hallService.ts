import Hall, { HallDocument } from '../models/Hall';

const createHall = async (hallData: Partial<HallDocument>): Promise<HallDocument> => {
  const newHall = new Hall(hallData);
  return await newHall.save();
};

const getAllHalls = async (): Promise<HallDocument[]> => {
  return await Hall.find();
};

export default {
  createHall,
  getAllHalls,
};
