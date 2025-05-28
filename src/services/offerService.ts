import Offer from '../models/Offer';

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
}

const createOffer = async (data: OfferInput) => {
  const offer = new Offer(data);
  return await offer.save();
};

const getAllOffers = async () => {
  return await Offer.find().sort({ cdate: -1 });
};

export default {
  createOffer,
  getAllOffers
};
