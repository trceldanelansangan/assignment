import { render, screen } from "@testing-library/react"
import UserList from "./UserList"
import { UserContext } from "../../store/userContext"

const initialValue = {
        users: [
            {
                id: 1,
                first_name: 'test1',
                name: null,
                email: 'test_email_1',
                avatar: 'https://reqres.in/img/faces/6-image.jpg',
                job: null
            },
            {
                id: 2,
                first_name: 'test2',
                name: null,
                email: 'test_email_2',
                avatar: 'https://reqres.in/img/faces/6-image.jpg',
                job: null
            }
        ],
        initializeUserList: () => {},
        addNewUser: () => {}
    }

describe('UserList Component', () => {
    const setUp = (hasApiError = false, value = initialValue ) => {
        render(
            <UserContext.Provider value={value}>
                <UserList hasApiError={hasApiError} />
            </UserContext.Provider>
        )
    }

    test('render error message when hasApiError is true', () => {
        setUp(true)

        expect(screen.getByTestId('api_helper_message')).toHaveTextContent('Unable to retrieve users list. Please try again later.')
    })

    test('render info message when when no active users', () => {
        setUp(false, {...initialValue, users: []})

        expect(screen.getByTestId('api_helper_message')).toHaveTextContent('No active users.')
    })

    test('render users list', () => {
        setUp(false)

        expect(screen.getAllByTestId('user_data_div').length).toBe(2)
        expect(screen.getByText('test1')).toBeInTheDocument()
        expect(screen.getByText('test2')).toBeInTheDocument()
    })
})