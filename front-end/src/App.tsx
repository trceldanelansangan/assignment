import { useContext, useEffect, useState } from "react";
import "./App.css";
import NewUserForm from "./component/NewUserForm/NewUserForm";

import { getUsers } from "./api/usersApi";
import UserList from "./component/UserList/UserList";
import Loader from "./component/Loader/Loader";
import { UserContext } from "./store/userContext";

export interface UserData {
  id: number
  first_name?: string | null
  name?: string | null
  email?: string | null
  avatar?: string | null
  job?: string | null
}

export default function App() {
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)
  const [usersApiError, setUsersApiError] = useState(null)
  const { initializeUserList } = useContext(UserContext)

  const loadUsers = async () => {
    setIsFetchingUsers((prevState) => !prevState)

    const res = await getUsers()

    if (res.errorMessage) {
      setUsersApiError(res.errorMessage)
    } else {
      initializeUserList(res.data);
      setUsersApiError(null)
    }

    setIsFetchingUsers((prevState) => !prevState)
  };

  useEffect(() => {
    loadUsers();
  }, []);
  
  return (isFetchingUsers ? <Loader /> :
    <div className="App">
      <h1>Hello ReqRes users!</h1>
      <UserList hasApiError={usersApiError !== null}/>
      <NewUserForm />
    </div>
  );
}
