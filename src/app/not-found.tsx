import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex gap-8  max-[770px]:flex-col mb-52 max-[500px]:mb-5 max-[770px]:mb-28 p-7 max-[500px]:p-2">
      <div>
        <p className="text-[7.5em] font-bold max-[770px]:text-center">404</p>
      </div>
      <div>
        <p className="text-[2em] font-bold ">UH OH! You're lost.</p>
        <p>
          The page you are looking for does not exist. How you got here is a
          mystery. But you can click the button below to go back to the
          home.
        </p>
        <div className="flex max-[770px]:justify-center mt-4 ">
          <Link
            href={"/"}
            className="uppercase rounded-full bg-green-500 px-8 py-1 font-bold max-[500px]:mx-8 max-[770px]:w-full text-center"
          >
            home
          </Link>
        </div>
      </div>
    </div>
  );
}
