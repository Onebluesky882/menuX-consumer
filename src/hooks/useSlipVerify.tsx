import { create } from "zustand";
import { checkSlipApi, SlipVerify } from "../api/slip-verifications.api";
import { slipVerifySchema } from "../schema/slipVerifySchema";

type SlipVerifyStore = {
  verifySlip: (
    qrcodeData: string,
    orderId: string,
    amount: string
  ) => Promise<boolean>;
};

const useSlipVerify = create<SlipVerifyStore>(() => ({
  verifySlip: async (qrcodeData, orderId, amount) => {
    try {
      const prepareData: SlipVerify = {
        amount,
        qrcode_data: qrcodeData,
        orderId,
      };

      const parsed = slipVerifySchema.safeParse(prepareData);
      if (!parsed.success) throw new Error("Invalid slip data format");

      const slipRes = await checkSlipApi.postSlip(parsed.data);
      if (!slipRes?.data)
        throw new Error("No data received from slip verification");

      return true;
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดในการตรวจสอบสลิป";

      if (error.response?.status === 400) {
        errorMessage = "ข้อมูล QR Code ไม่ถูกต้อง กรุณาสแกนใหม่";
      } else if (error.response?.status === 404) {
        errorMessage = "ไม่พบข้อมูลสลิป";
      } else if (error.response?.status === 422) {
        errorMessage = "จำนวนเงินไม่ตรงกับสลิป";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // throw หรือ return false พร้อมข้อความก็ได้
      throw new Error(errorMessage);
    }
  },
}));

export default useSlipVerify;
