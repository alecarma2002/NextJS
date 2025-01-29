import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
import { fetchCustomers } from '@/app/lib/data';
 
export const metadata: Metadata = {
  title: 'Crea fascicolo',
};
 
export default async function Page() {

  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Fascicolo', href: '/dashboard/fascicoli' },
          {
            label: 'Crea fascicolo',
            href: '/dashboard/fascicoli/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers}/>
    </main>
  );
}