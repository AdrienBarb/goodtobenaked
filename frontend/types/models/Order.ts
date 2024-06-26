import { Address } from "./Address";
import { Creator } from "./Creator";
import { Member } from "./Member";
import { OrderActivity } from "./OrderActivity";
import { PrivateService } from "./PrivateService";
import { Product } from "./Product";
import { Service } from "./Service";
import { Option } from "./optionModel";
import { Package } from "./packageModel";

export interface Order {
  _id: string;
  seller: Creator;
  buyer: Member;
  product: Product;
  service: Service;
  package: Package;
  options: Option[];
  privateService: PrivateService;
  state:
    | "new"
    | "shipped"
    | "accepted"
    | "rejectedWhileNew"
    | "rejectedWhileAccepted"
    | "received"
    | "completed"
    | "rejectedBySeller"
    | "rejectedByBuyer"
    | "commentedFromMember";
  deliveryAddress: Address;
  activities: OrderActivity[];
  trackingNumber?: string;
  trackingLink?: string;
  createdAt: string;
  haveBeenPaid: boolean;
  withOptions: boolean;
  cost: number;
  deliveryCost: number;
  succeed: boolean;
  status: "initialized" | "failed" | "succeeded";
  instruction?: string;
}
