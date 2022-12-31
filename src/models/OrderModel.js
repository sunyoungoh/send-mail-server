import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderSerial: {
      type: String,
      required: true,
    },
    detailIdx: {
      type: String,
      required: true,
    },
    ordererId: {
      type: String,
    },
    ordererName: {
      type: String,
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
    itemOption: {
      type: String,
    },
    requireMemo: {
      type: String,
    },
    ordererPhone: {
      type: String,
    },
    ordererEmail: {
      type: String,
    },
    orderDate: {
      type: Date,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
