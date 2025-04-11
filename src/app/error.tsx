"use client";

export default function ErrorPage({ error }: { error?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Oops! 404</h1>

        {error ? <p className="text-2xl mb-6">{error}</p>: <p className="text-2xl mb-6">
          It seems like the page you're looking for doesn't exist.
        </p>}

       

        <div className="flex justify-center">
          <a
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
