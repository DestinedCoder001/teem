import { Loader } from "lucide-react"

const AuthLoading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
        <div className="text-xl font-semibold animate-spin"><Loader size={36} color="#EC4899" className="font-bold" /></div>
      </div>
  )
}

export default AuthLoading