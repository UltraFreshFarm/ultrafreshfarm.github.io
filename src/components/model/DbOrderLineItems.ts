export interface DbOrderLineItems {
    barcode: string;//"ABC-DEF-GHI"
    category: string;//"Fresh Milk"
    created_at?: string;//"2022-11-02T20:14:47.627626+00:00"
    id?: number;//1
    name: string;//"Strawberry"
    order: number;//1
    price: number;//3
    requested_amount: number;//5
    shelf_life: string;//"5"
    shelf_life_type: string;//"DAYS"
    unit: string;//"500"
    unit_type: string;//"Milliliter"
    fulfilled_amount: number;
}