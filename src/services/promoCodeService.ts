import PromoCode from '../models/PromoCode';
import { Document } from 'mongoose';

export interface IPromoCode extends Document {
  room_id: string;
  start_date: Date;
  end_date: Date;
  promo_code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  status?: 'active' | 'inactive' | 'expired';
  usage_limit?: number;
  used_count?: number;
  cdate?: Date;
}

interface PromoCodeInput {
  room_id: string;
  start_date: Date;
  end_date: Date;
  promo_code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  status?: 'active' | 'inactive' | 'expired';
  usage_limit?: number;
  used_count?: number;
}

export class PromoCodeService {
  async createPromoCode(data: PromoCodeInput): Promise<IPromoCode> {
    try {
      // Check if promo code already exists
      const existingPromoCode = await PromoCode.findOne({ promo_code: data.promo_code });
      if (existingPromoCode) {
        throw new Error('Promo code already exists');
      }

      const promoCode = new PromoCode({
        ...data,
        status: data.status || 'active',
        used_count: 0
      });
      return await promoCode.save();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create promo code');
    }
  }

  async getAllPromoCodes(): Promise<IPromoCode[]> {
    try {
      return await PromoCode.find()
        .populate('room_id', 'room_title')
        .sort({ cdate: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch promo codes');
    }
  }

  async getPromoCodeById(id: string): Promise<IPromoCode | null> {
    try {
      const promoCode = await PromoCode.findById(id)
        .populate('room_id', 'room_title');
      return promoCode;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch promo code');
    }
  }

  async validatePromoCode(code: string, roomId: string): Promise<{
    valid: boolean;
    promoCode?: IPromoCode;
    discount?: number;
    type?: string;
    message?: string;
  }> {
    try {
      const promoCode = await PromoCode.findOne({ 
        promo_code: code,
        room_id: roomId,
        status: 'active'
      });

      if (!promoCode) {
        return {
          valid: false,
          message: 'Invalid or inactive promo code'
        };
      }

      const currentDate = new Date();
      if (currentDate < promoCode.start_date || currentDate > promoCode.end_date) {
        return {
          valid: false,
          message: 'Promo code has expired or not yet active'
        };
      }

      if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
        return {
          valid: false,
          message: 'Promo code usage limit exceeded'
        };
      }

      return {
        valid: true,
        promoCode,
        discount: promoCode.discount,
        type: promoCode.type,
        message: 'Promo code is valid'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to validate promo code');
    }
  }

  async updatePromoCode(id: string, data: Partial<PromoCodeInput>): Promise<IPromoCode | null> {
    try {
      const promoCode = await PromoCode.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      ).populate('room_id', 'room_title');
      return promoCode;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update promo code');
    }
  }

  async deletePromoCode(id: string): Promise<IPromoCode | null> {
    try {
      const promoCode = await PromoCode.findByIdAndDelete(id);
      return promoCode;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete promo code');
    }
  }

  async incrementUsageCount(id: string): Promise<void> {
    try {
      await PromoCode.findByIdAndUpdate(id, { $inc: { used_count: 1 } });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to increment usage count');
    }
  }

  async getActivePromoCodes(): Promise<IPromoCode[]> {
    try {
      const currentDate = new Date();
      return await PromoCode.find({
        status: 'active',
        start_date: { $lte: currentDate },
        end_date: { $gte: currentDate }
      })
      .populate('room_id', 'room_title')
      .sort({ cdate: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch active promo codes');
    }
  }
}

export default PromoCodeService;