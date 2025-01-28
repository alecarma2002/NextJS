import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Aggiungi cliente',
};
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clienti', href: '/dashboard/customers' },
          {
            label: 'Aggiungi cliente',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}