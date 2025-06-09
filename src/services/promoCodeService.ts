import { get } from 'http';
import PromoCode from '../models/PromoCode';

interface PromoCodeInput {
  room_id: string;
  start_date: Date;
  end_date: Date;
  promo_code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  status?: 'active' | 'inactive' | 'expired';
}

const createPromoCode = async (data: PromoCodeInput) => {
  const promoCode = new PromoCode(data);
  return await promoCode.save();
};

const getAllPromoCodes = async () => {
  return await PromoCode.find()
    .populate('room_id', 'room_title') 
    .sort({ cdate: -1 });      
}
const deletePromoCode = async (id: string) => {
  return await PromoCode.findByIdAndDelete(id);
};


export default {
  createPromoCode,
  getAllPromoCodes,
  deletePromoCode
};
