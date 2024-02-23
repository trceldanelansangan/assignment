import { useContext } from "react";
import noImageAvailable from "../../assets/no_image_available.jpeg"
import "./UserList.css"
import { UserContext } from "../../store/userContext";

function ApiHelperMessage({ 
  messageStyle, 
  message 
}: {
  messageStyle: string,
  message: string
}) {
  return (
    <div className="apiMessageContainer">
      <div data-testid="api_helper_message" className={`apiMessage ${messageStyle}`}>
        {message}
      </div>
    </div>
  )
}

function UserList({ 
 hasApiError, 
}: {
 hasApiError: boolean
}) {
  const { users } = useContext(UserContext)

  if (hasApiError) {
    return (
      <ApiHelperMessage 
        messageStyle="errorContainer" 
        message="Unable to retrieve users list. Please try again later."
        />
    )
  }

  return (
      <div className="flex">
      {users.length !== 0 &&
        users.map((user) => {
          return (
            <div data-testid="user_data_div" key={user.id}>
              <p>
                <strong>{user.first_name || user.name}</strong>
              </p>
              <p>{user.email || user.job}</p>
              <img key={user.avatar} alt="User Avatar" src={user.avatar || noImageAvailable} />
            </div>
          );
        })}
      {users.length === 0 && 
        <ApiHelperMessage 
          messageStyle="infoMessage"
          message="No active users." />
      }
    </div>
  )
}

export default UserList