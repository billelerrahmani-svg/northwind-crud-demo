export interface Products {
  productid?: number;
  productname: string;
  supplierid?: number;
  categoryid?: number;
  quantityperunit?: string;
  unitprice?: number;
  unitsinstock?: number;
  unitsonorder?: number;
  reorderlevel?: number;
  discontinued: boolean;
}
