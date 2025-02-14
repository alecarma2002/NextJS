// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};


export type LatestFascicoli = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  type: string;
};


export type FascicoliTable = {
  id: string;
  customer_Id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  type: string;
  number: number;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_fascicoli: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_fascicoli: number;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type FascicoliForm = {
  id: string;
  customer_id: string;
  type: string;
  number: number;
};
