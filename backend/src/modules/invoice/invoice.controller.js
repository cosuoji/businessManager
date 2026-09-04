import {
  getInvoiceData,
  generateInvoicePDF,
  getInvoices,
  getPublicInvoiceData,
} from "./invoice.service.js";

export const previewInvoice =
  async (req, res, next) => {
    try {
      const invoice =
        await getInvoiceData(
          req.user.id,
          req.params.orderId
        );

      return res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  };

export const downloadInvoice =
  async (req, res, next) => {
    try {
      const invoice =
        await getInvoiceData(
          req.user.id,
          req.params.orderId
        );

      const pdf =
        await generateInvoicePDF(
          invoice
        );

      const filename =
        `${invoice.invoiceNumber}.pdf`;

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

export const listInvoices =
  async (req, res, next) => {
    try {
      const result =
        await getInvoices(
          req.user.id,
          {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            dateFrom:
              req.query.dateFrom,
            dateTo:
              req.query.dateTo,
          }
        );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

export const viewPublicInvoice =
  async (req, res, next) => {
    try {
      const invoice =
        await getPublicInvoiceData(
          req.params.token
        );

      return res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  };

export const downloadPublicInvoice =
  async (req, res, next) => {
    try {
      const invoice =
        await getPublicInvoiceData(
          req.params.token
        );

      const pdf =
        await generateInvoicePDF(
          invoice
        );

      const filename =
        `${invoice.invoiceNumber}.pdf`;

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
