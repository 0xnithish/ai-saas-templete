import { Suspense } from 'react';

function ConfirmationContent({ searchParams }: { searchParams: { checkout_id?: string } }) {
  const checkoutId = searchParams.checkout_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          
          {checkoutId ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Thank you for your purchase. Your checkout has been processed successfully.
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-500">Checkout ID:</p>
                <p className="font-mono text-sm">{checkoutId}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Thank you for your purchase. Your checkout has been processed successfully.
            </p>
          )}
          
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { checkout_id?: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent searchParams={searchParams} />
    </Suspense>
  );
}
