import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  FascicoliForm,
  FascicoliTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';


export async function fetchRevenue() {
  try {

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}


export async function fetchCardData() {
  try {
    const fascicoliCountPromise = sql`SELECT COUNT(*) FROM fascicoli`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;

    const data = await Promise.all([
      fascicoliCountPromise,
      customerCountPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}



const ITEMS_PER_PAGE = 6;
export async function fetchFilteredFascicoli(
  query: string,
  currentPage: number,
 ) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const fascicoli = await sql<FascicoliTable>`
      SELECT
        fascicoli.id,
        fascicoli.type,
        fascicoli.date,
        fascicoli.number,
        customers.name,
        customers.email,
        customers.image_url
      FROM fascicoli
      JOIN customers ON fascicoli.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        fascicoli.type ILIKE ${`%${query}%`} OR
        fascicoli.date::text ILIKE ${`%${query}%`} OR
        fascicoli.number::text ILIKE ${`%${query}%`}
      ORDER BY fascicoli.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return fascicoli.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM fascicoli
    JOIN customers ON fascicoli.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      fascicoli.type ILIKE ${`%${query}%`} OR
      fascicoli.date::text ILIKE ${`%${query}%`} OR
      fascicoli.number::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<FascicoliForm>`
      SELECT
        fascicoli.id,
        fascicoli.customer_id,
        fascicoli.type,
        fascicoli.number
      FROM fascicoli
      WHERE fascicoli.id = ${id};
    `;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Fascicolo.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchFilteredCustomers(query: string, currentPage: number,) {

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(fascicoli.id) AS total_fascicoli
  		FROM customers
		LEFT JOIN fascicoli ON customers.id = fascicoli.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
