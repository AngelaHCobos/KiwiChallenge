import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  doc,
  CollectionReference,
  limit as limitBy,
  orderBy,
  startAt,
  updateDoc,
  where,
  Firestore,
  DocumentReference,
  QuerySnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

export default class DatabaseService {
  private db: Firestore;
  private deliveriesCollection: CollectionReference;
  private botsCollection: CollectionReference;
  constructor() {
    this.db = getFirestore(
      initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      })
    );

    this.deliveriesCollection = collection(this.db, "deliveries");
    this.botsCollection = collection(this.db, "bots");
  }
  async createBot(data: Bot): Promise<DocumentReference> {
    return await addDoc(this.botsCollection, data);
  }
  async getBotsByZone(zone: string): Promise<Bot[]> {
    const data = await getDocs(
      query(this.botsCollection, where("zone_id", "==", zone))
    );
    return data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Bot;
    });
  }
  async getDeliveriesByZone(zone: string): Promise<Delivery[]> {
    const data = await getDocs(
      query(this.deliveriesCollection, where("zone_id", "==", zone))
    );
    return data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Delivery;
    });
  }
  async assignBotToDelivery(bot: Bot, delivery: Delivery) {
    await updateDoc(doc(this.db, this.deliveriesCollection.path, delivery.id), {
      status: "busy",
    });
    await updateDoc(doc(this.db, this.botsCollection.path, bot.id), {
      state: "assigned",
    });
  }
  async createDelivery(data: Delivery): Promise<DocumentReference> {
    data.creation_date = new Date();
    return await addDoc(this.deliveriesCollection, data);
  }
  async getDeliveries(offset: number, limit: number): Promise<Delivery[]> {
    const data = await getDocs(
      query(
        this.deliveriesCollection,
        orderBy("creation_date"),
        startAt(offset),
        limitBy(limit)
      )
    );
    return data.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Delivery;
    });
  }
  async getDeliveryByID(id: string): Promise<Delivery | null> {
    const delivery = await getDoc(doc(this.db, "deliveries", id));
    if (!delivery.exists) return null;
    return {
      id: delivery.id,
      ...delivery.data(),
    } as Delivery;
  }
}
