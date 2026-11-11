import mongoose from 'mongoose';

export const SALES_FIELDS = ['salesImpacted', 'averageSales', 'notSold'];

const percentage = {
  type: Number,
  required: true,
  min: [0, '{PATH} cannot be below 0%'],
  max: [100, '{PATH} cannot exceed 100%'],
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    salesImpacted: percentage,
    averageSales: percentage,
    notSold: percentage,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const percentageTotal = (values) =>
  Number(SALES_FIELDS.reduce((sum, field) => sum + Number(values[field] || 0), 0).toFixed(2));

productSchema.pre('validate', function () {
  if (percentageTotal(this) !== 100) {
    this.invalidate('salesImpacted', 'Sales impacted, average sales and not sold must add up to 100%');
  }
});

export default mongoose.model('Product', productSchema);
