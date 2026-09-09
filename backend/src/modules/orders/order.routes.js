import express from "express";

import {
  create,
  list,
  getOne,
  update,
  archive,
  restore,
} from "./order.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", archive);
router.patch("/:id/restore", restore);

export default router;
