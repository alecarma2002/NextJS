import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
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
          { label: 'Fascicolo', href: '/dashboard/fascicoli' },
          {
            label: 'Crea fascicolo',
            href: '/dashboard/fascicoli/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}