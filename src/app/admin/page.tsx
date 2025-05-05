import Link from "next/link"
const adminPage = () => {
  return (
    <div>
        <Link className="bg-green-500 p-4 text-lg font-bold " href={'admin/login'}>login</Link>
    </div>
  )
}

export default adminPage