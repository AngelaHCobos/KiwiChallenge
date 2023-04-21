import { Request, Response } from "express";
import { db } from "../index";

/**
 * @swagger
 * tags:
 *   name: Bots
 *   description: The bots managing API
 * /bots:
 *   post:
 *     summary: Creates a new bot
 *     tags: [Bots]
 *     responses:
 *       200:
 *         description: Bot created succesfully.
 * /bots/{zone}:
 *   get:
 *     summary: Get all bots in a zone
 *     tags: [Bots]
 *     parameters:
 *       - in: path
 *         name: zone
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: All bots in the zone.
 *       500:
 *         description: Some server error.
 * /bots/{zone}/assign:
 *   post:
 *     summary: Assigns all available bots in a zone to pending deliveries
 *     tags: [Bots]
 *     parameters:
 *       - in: path
 *         name: zone
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Bots assigned successfully.
 *       500:
 *         description: Some server error.
 **/

export const createBot = async (req: Request, res: Response) => {
  await db.createBot(req.body);
  res.sendStatus(200);
};

export const getBotsByZone = async (req: Request, res: Response) => {
  const bots = await db.getBotsByZone(req.params.zone);
  res.status(200).send(bots);
};

export const assignBotsToDeliveries = async (req: Request, res: Response) => {
  const botsData = await db.getBotsByZone(req.params.zone);
  const deliveriesData = await db.getDeliveriesByZone(req.params.zone);

  const freeBots = botsData.filter((doc) => doc.status === "available");
  const pendingDeliveries = deliveriesData.filter(
    (doc) => doc.state === "pending"
  );

  for (const bot of freeBots) {
    const delivery = pendingDeliveries.pop();
    if (!delivery) break;
    db.assignBotToDelivery(bot, delivery);
  }

  res.sendStatus(200);
};
