export interface SingleCartItem
{
id:string;
product_id: string;
quantity: any;

}

export interface rowCartItem extends SingleCartItem {
    actualPrice: number;
    title: string;
    totalAmount: number;
  }