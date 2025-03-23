import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative w-10 h-10 bg-gradient-to-br from-pastel-pink to-pastel-blue rounded-lg flex items-center justify-center mr-2">
        <span className="font-bold text-gray-500 text-xl">Y</span>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-md flex items-center justify-center">
          <span className="font-bold text-pastel-green text-xs">2B</span>
        </span>
      </div>
      {/* <span className="font-bold text-xl">Your Second Brain</span> */}
    </Link>
  )
}

