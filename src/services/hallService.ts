import { get } from 'mongoose';
import Hall, { HallDocument } from '../models/Hall';

const createHall = async (hallData: Partial<HallDocument>): Promise<HallDocument> => {
  const newHall = new Hall(hallData);
  return await newHall.save();
};

const getAllHalls = async (): Promise<HallDocument[]> => {
  return await Hall.find();
};

const getHallById = async (id: string): Promise<HallDocument | null> => {
  return await Hall.findById(id);   
}

const updateHall = async (id: string, hallData: Partial<HallDocument>): Promise<HallDocument | null> => {
  return await Hall.findByIdAndUpdate(id, hallData, { new: true });
};

const deleteHall = async (id: string): Promise<HallDocument | null> => {
  return await Hall.findByIdAndDelete(id);    

}

export default {
  createHall,
  getAllHalls,
  updateHall,
  getHallById,
  deleteHall
};
