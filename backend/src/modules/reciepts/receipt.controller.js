import {
  getReceiptData,
  generateReceiptPDF,
} from "./receipt.service.js";

export const downloadReceipt =
  async (req, res, next) => {
    try {
      const receipt =
        await getReceiptData(
          req.user.id,
          req.params.paymentId
        );

      const pdf =
        await generateReceiptPDF(
          receipt
        );

      const filename =
        `${receipt.receiptNumber}.pdf`;

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      return res.send(pdf);
    } catch (error) {
      next(error);
    }
  };
