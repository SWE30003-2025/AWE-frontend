import { useEffect, useState } from "react";
import { listUsers, User } from "../api";

export default function Home() {
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    listUsers().then(setUsers);
  }, []);
  
  console.log(users);
  
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-blue-700">Welcome to AWE Electronics</h1>
      <p className="mt-4 text-lg text-gray-600">Your one-stop shop for tech gear!</p>
    </div>
  );
}
