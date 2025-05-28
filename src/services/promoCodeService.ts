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

export default {
  createPromoCode,
};
