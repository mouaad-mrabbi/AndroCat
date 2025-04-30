import Link from "next/link"

const dashboardPage = () => {
  return (
    <div className="flex gap-5">
        <Link className="bg-green-500 text-black p-3" href={'create'}>Create Pending Item</Link>
        <Link className="bg-green-500 text-black p-3" href={'pendingItems/page/1'}>Pending Items</Link>
        <Link className="bg-green-500 text-black p-3" href={'items/page/1'}>items</Link>
        <Link className="bg-green-500 text-black p-3" href={'rating'}>rating</Link>
    </div>
  )
}

export default dashboardPage