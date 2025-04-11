import Link from "next/link"
const adminPage = () => {
  return (
    <div>
        <Link className="bg-green-500" href={'admin/login'}>login</Link>
    </div>
  )
}

export default adminPage