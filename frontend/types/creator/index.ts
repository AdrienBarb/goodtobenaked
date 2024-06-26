export type CreateDeliveryZoneArgumentTypes = {
  _id?: string;
  region: string;
  countries: string[];
  small: number;
  medium: number;
  large: number;
};

export type GetRelayPointsArgumentTypes = {
  zip: string;
  city: string;
};

export type CreateRelayShippmentArgumentTypes = {
  addressFromId: string;
  parcelId: string;
  addressTo: {
    name: string;
    email: string;
    company: string;
    street1: string;
    city: string;
    zip: string;
    country: string;
    mondialRelayId: string;
  };
};

export type RateTypes = {
  provider: string;
  amount: number;
  object_id: string;
  servicelevel: {
    name: string;
    token: string;
  };
};

export type Relay = {
  CP: string;
  Distance: string;
  Horaires_Dimanche: { string: string[] };
  Horaires_Jeudi: { string: string[] };
  Horaires_Lundi: { string: string[] };
  Horaires_Mardi: { string: string[] };
  Horaires_Mercredi: { string: string[] };
  Horaires_Samedi: { string: string[] };
  Horaires_Vendredi: { string: string[] };
  Information: string;
  Informations_Dispo: null;
  Latitude: string;
  LgAdr1: string;
  LgAdr3: string;
  Localisation1: string;
  Longitude: string;
  Num: string;
  Pays: string;
  STAT: string;
  TypeActivite: string;
  URL_Photo: string;
  URL_Plan: string;
  Ville: string;
};

export type ShippmentType = {
  address_from: ShippoAddressType;
  address_return: ShippoAddressType;
  address_to: ShippoAddressType;
  alternate_address_to: ShippoAddressType | null;
  carrier_accounts: string[];
  customs_declaration: string | null;
  extra: Record<string, unknown>;
  messages: {}[];
  metadata: string;
  object_created: string;
  object_id: string;
  object_owner: string;
  object_updated: string;
  order: string | null;
  parcels: ParcelType[];
  rates: RateTypes[];
  shipment_date: string;
  status: string;
  test: boolean;
};

export type ShippoAddressType = {
  city: string;
  company: string;
  country: string;
  email: string;
  is_complete: boolean;
  is_residential: boolean | null;
  name: string;
  object_id: string;
  phone: string;
  state: string;
  street1: string;
  street2: string;
  street3: string;
  street_no: string;
  test: boolean;
  validation_results: Record<string, unknown>;
  zip: string;
};

export type ParcelType = {
  distance_unit: string;
  extra: Record<string, unknown>;
  height: string;
  length: string;
  line_items: any[];
  mass_unit: string;
  metadata: string;
  object_created: string;
  object_id: string;
  object_owner: string;
  object_state: string;
  object_updated: string;
  template: null;
  test: boolean;
  value_amount: null;
  value_currency: null;
  weight: string;
  width: string;
};
