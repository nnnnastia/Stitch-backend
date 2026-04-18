import { Router } from "express";
import {
    searchCities,
    getWarehouses,
} from "./shipping.controller.js";

const router = Router();

router.get("/cities", searchCities);
router.get("/warehouses", getWarehouses);

export default router;