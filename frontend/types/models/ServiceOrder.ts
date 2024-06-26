import { Creator } from "./Creator";
import { Member } from "./Member";
import { Option } from "./optionModel";
import { Package } from "./packageModel";
import { Service } from "./Service";
import { OrderActivity } from "./OrderActivity";
import { PrivateService } from "./PrivateService";
import { Address } from "./Address";

export interface ServiceOrder {
  _id: string;
  seller: Creator;
  buyer: Member;
  state:
    | "new"
    | "accepted"
    | "rejectedByBuyer"
    | "rejectedBySeller"
    | "completed"
    | "commentedFromMember";
  acceptedAt: string;
  createdAt: string;
  status: "initialized" | "failed" | "succeeded";
  orderType: "standardOrder" | "specialRequest";
  service: Service;
  package: Package;
  options: Option[];
  orderCost: number;
  processingCost: number;
  activities: OrderActivity[];
  privateService: PrivateService;
  deliveryAddress: Address;
  instruction: string;
}
