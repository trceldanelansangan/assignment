import { ReactNode, createContext, useState } from "react"
import { UserData } from "../App"

interface UserDataContextObj {
    users: UserData[],
    initializeUserList: (value: UserData[]) => void,
    addNewUser: (value: UserData) => void
}

export const UserContext = createContext<UserDataContextObj>({
    users: [],
    initializeUserList: (value: UserData[]) => {},
    addNewUser: (value: UserData) => {}
})

function UserDataContextProvider({ children }: { children: ReactNode}) {

    const [users, setUsers] = useState<UserData[]>([])

    //I just store the added user here in the context state because the post endpoint
    //for creating new user on reqres api doesn't actually add the user to the get user list endpoint response
    //Added user will be cleared on page refresh
    const addNewUserHandler = (payload: UserData) => {
        setUsers((prevState) => {
            return prevState.concat(payload)
        })
    }

    const initializeUserList = (initialUserList: UserData[]) => {
        setUsers(initialUserList)
    }

    const contextValue = {
        users: users,
        initializeUserList: initializeUserList,
        addNewUser: addNewUserHandler
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export default UserDataContextProvider