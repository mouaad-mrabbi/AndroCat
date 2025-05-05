import Link from "next/link"

const dashboardPage = () => {
  return (
    <div className="flex gap-5">
        <Link className="bg-green-500 text-black p-3" href={'create'}>Create Pending article</Link>
        <Link className="bg-green-500 text-black p-3" href={'pendingArticles/page/1'}>Pending articles</Link>
        <Link className="bg-green-500 text-black p-3" href={'articles/page/1'}>article</Link>
        <Link className="bg-green-500 text-black p-3" href={'rating'}>rating</Link>
    </div>
  )
}

export default dashboardPage