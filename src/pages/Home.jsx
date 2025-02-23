import { useLogout } from "../hooks/useAuth";

export function Home() {
    const handleLogOut = useLogout();
    return(
        <>
          <div>
      <h1>Welcome to Home Page</h1>
      <button onClick={handleLogOut} >
        Logout
      </button>
    </div>
        </>
    )
}