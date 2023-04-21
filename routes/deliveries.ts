import { Request, Response } from "express";
import { db } from "../index";

/**
 *
 * tags:
 *   name: Deliveries
 *   description: The deliveries managing API
 * /deliveries:
 *   post:
 *     summary: Creates a new delivery
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Delivery created successfully.
 *   get:
 *     summary: Get all deliveries, allows for pagination
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: offset
 *         schema:
 *           type: number
 *         required: false
 *       - in: path
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *     responses:
 *       200:
 *         description: All deliveries.
 *       500:
 *         description: Some server error.
 * /deliveries/{id}:
 *   get:
 *     summary: Gets a single delivery by id.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The requested delivery.
 *       404:
 *         description: No delivery with that id was found.
 *       500:
 *         description: Some server error.
 **/

export const createDelivery = async (req: Request, res: Response) => {
  await db.createDelivery(req.body);
  res.sendStatus(200);
};

export const getDeliveries = async (req: Request, res: Response) => {
  const offset_param = parseInt(req.query["offset"] as string) || 0;
  const limit_param = parseInt(req.query["limit"] as string) || 100;
  const deliveries = await db.getDeliveries(offset_param, limit_param);
  res.status(200).send(deliveries);
};

export const getDeliveryByID = async (req: Request, res: Response) => {
  const delivery = await db.getDeliveryByID(req.params.id);
  if (delivery) {
    res.status(200).send(delivery);
    return;
  }
  res.sendStatus(404);
};
