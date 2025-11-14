export default function ConfirmationPage({
  searchParams: { checkoutId },
}: {
  searchParams: {
    checkoutId: string;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-3xl font-bold">Thank you!</h1>
        <p className="text-lg">Your checkout is now being processed.</p>
        {checkoutId && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Checkout ID:</p>
            <p className="font-mono text-xs break-all">{checkoutId}</p>
          </div>
        )}
        <p>You will receive a confirmation email once your payment is complete.</p>
      </div>
    </div>
  );
}
