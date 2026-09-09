import express from "express";

import {
  create,
  list,
  stats,
  history,
  remove,
} from "./payment.controller.js";

const router =
  express.Router();

router.post("/", create);
router.get("/", list);
router.get("/stats", stats);
router.get(
  "/order/:orderId",
  history
);
router.delete("/:id", remove);

export default router;
