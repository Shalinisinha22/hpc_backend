import { Package } from '../models';

export class PackageService {
  async createPackage(packageData: any) {
    const packageItem = new Package(packageData);
    await packageItem.save();
    return packageItem;
  }

  async getPackages() {
    return Package.find();
  }

  async getPackageById(id: string) {
    return Package.findById(id);
  }

  async updatePackage(id: string, packageData: any) {
    return Package.findByIdAndUpdate(id, packageData, { new: true });
  }

  async deletePackage(id: string) {
    return Package.findByIdAndDelete(id);
  }
}