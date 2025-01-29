import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredFascicoli } from '@/app/lib/data';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const fascicoli = await fetchFilteredFascicoli(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {fascicoli?.map((fascicolo) => (
              <div
                key={fascicolo.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={fascicolo.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${fascicolo.name}'s profile picture`}
                      />
                      <p>{fascicolo.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{fascicolo.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                    {fascicolo.name}
                    </p>
                    <p>{formatDateToLocal(fascicolo.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={fascicolo.id} />
                    <DeleteInvoice id={fascicolo.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tipologia
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Modifica</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {fascicoli?.map((fascicolo) => (
                <tr
                  key={fascicolo.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={fascicolo.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${fascicolo.name}'s profile picture`}
                      />
                      <p>{fascicolo.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {fascicolo.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {fascicolo.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(fascicolo.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={fascicolo.id} />
                      <DeleteInvoice id={fascicolo.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
