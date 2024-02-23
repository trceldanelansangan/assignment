import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';
import UserDataContextProvider from './store/userContext';
import * as apiModule from "./api/usersApi"

describe('App Component', () => {
  test('should render loading spiner for UserList component and NewUserForm component', () => {
    render(<App />);
    expect(screen.getByTestId('loading_spinner')).toBeInTheDocument()
  })

  test('render list of user after fetching data from api', async () => {
    const mockData = [
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
  ];

  const getUsers = jest.spyOn(apiModule, "getUsers")
    
  getUsers.mockResolvedValue({ data: mockData })
  render(<UserDataContextProvider><App /></UserDataContextProvider>);

  await waitFor(() => {
    expect(screen.queryByTestId('loading_spinner')).not.toBeInTheDocument()
  })

  expect(screen.getAllByTestId('user_data_div').length).toBe(2)
  expect(screen.getByText('test1')).toBeInTheDocument()
  expect(screen.getByText('test2')).toBeInTheDocument()
  })

  test('added user should show on the list', async () => {
    const mockData = [
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
  ];

  const getUsers = jest.spyOn(apiModule, "getUsers")
  const addUser = jest.spyOn(apiModule, "addUser")

  getUsers.mockResolvedValue({ data: mockData })
  addUser.mockResolvedValue({ 
    id: 1233,
    name: 'Test Name',
    job: 'Test Job' 
  })
  
  render(<UserDataContextProvider><App /></UserDataContextProvider>);

  await waitFor(() => {
    
    expect(screen.queryByTestId('loading_spinner')).not.toBeInTheDocument()
    
  })

  expect(screen.getAllByTestId('user_data_div').length).toBe(2)
  expect(screen.getByText('test1')).toBeInTheDocument()
  expect(screen.getByText('test2')).toBeInTheDocument()

  const nameInput = screen.getByTestId('form_name_input_field') as HTMLInputElement
  fireEvent.change(nameInput, { target: { value: 'Test Name' }})
  const jobInput = screen.getByTestId('form_job_input_field') as HTMLInputElement
  fireEvent.change(jobInput, { target: { value: 'Test Job' }})
  const submitButton = screen.getByText('Submit') as HTMLButtonElement
  fireEvent.click(submitButton)
  expect(screen.queryByTestId('loading_spinner')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.queryByTestId('loading_spinner')).not.toBeInTheDocument()
  })

  expect(screen.getByText('Test Name')).toBeInTheDocument()
  expect(screen.getByText('Test Job')).toBeInTheDocument()
  addUser.mockRestore()
  getUsers.mockRestore()

  })
})
