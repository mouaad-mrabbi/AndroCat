import Link from "next/link"

const dashboardPage = () => {
  return (
    <div className="grid grid-cols-4 max-[700px]:grid-cols-2 gap-5 text-center font-bold p-8">
        <Link className="bg-green-500 text-black p-3" href={'create'}>Create Pending article</Link>
        <Link className="bg-green-500 text-black p-3" href={'pendingArticles/page/1'}>Pending articles</Link>
        <Link className="bg-green-500 text-black p-3" href={'articles/page/1'}>article</Link>
        <Link className="bg-green-500 text-black p-3" href={'rating'}>rating</Link>
    </div>
  )
}

export default dashboardPage