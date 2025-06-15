import Offer from '../models/Offer';
import { Document } from 'mongoose';

export interface IOffer extends Document {
  offer_name: string;
  offer_rate_code: string;
  short_intro: string;
  desc?: string;
  terms?: string;
  email_text?: string;
  image: {
    url: string;
    name: string;
    ext: string;
  };
  status?: 'active' | 'inactive' | 'expired';
  cdate?: Date;
  valid_from?: Date;
  valid_to?: Date;
  discount_percentage?: number;
  discount_amount?: number;
}

interface OfferInput {
  offer_name: string;
  offer_rate_code: string;
  short_intro: string;
  desc?: string;
  terms?: string;
  email_text?: string;
  image: {
    url: string;
    name: string;
    ext: string;
  };
  status?: 'active' | 'inactive' | 'expired';
  valid_from?: Date;
  valid_to?: Date;
  discount_percentage?: number;
  discount_amount?: number;
}

export class OfferService {
  async createOffer(data: OfferInput): Promise<IOffer> {
    try {
      const offer = new Offer(data);
      return await offer.save();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create offer');
    }
  }

  async getAllOffers(): Promise<IOffer[]> {
    try {
      return await Offer.find().sort({ cdate: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch offers');
    }
  }

  async getOfferById(id: string): Promise<IOffer | null> {
    try {
      const offer = await Offer.findById(id);
      return offer;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch offer');
    }
  }

  async updateOffer(id: string, data: Partial<OfferInput>): Promise<IOffer | null> {
    try {
      const offer = await Offer.findByIdAndUpdate(
        id, 
        { $set: data }, 
        { new: true, runValidators: true }
      );
      return offer;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update offer');
    }
  }

  async deleteOffer(id: string): Promise<IOffer | null> {
    try {
      const offer = await Offer.findByIdAndDelete(id);
      return offer;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete offer');
    }
  }

  async getActiveOffers(): Promise<IOffer[]> {
    try {
      const currentDate = new Date();
      return await Offer.find({
        status: 'active',
        $or: [
          { valid_from: { $lte: currentDate }, valid_to: { $gte: currentDate } },
          { valid_from: { $exists: false }, valid_to: { $exists: false } }
        ]
      }).sort({ cdate: -1 });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch active offers');
    }
  }
}

export default OfferService;