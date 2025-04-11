import { cookies } from "next/headers";

export async function getServerSideProps() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value || "";
  return { props: { token } };
}
