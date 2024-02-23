import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import NewUserForm from "./NewUserForm"
import * as apiModule from "../../api/usersApi"

describe('NewUserForm Component', () => {
    const setUp = () => {
        render(<NewUserForm />)
    }

    beforeEach(() => {
        setUp()
    })

    test('should render form elements', () => {
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByTestId('form_name_input_field')).toBeInTheDocument()
        expect(screen.getByText('Job')).toBeInTheDocument()
        expect(screen.getByTestId('form_job_input_field')).toBeInTheDocument()
        expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    test('should validate name input events', () => {
        const nameInput = screen.getByTestId('form_name_input_field') as HTMLInputElement
        fireEvent.change(nameInput, { target: { value: 'Test Name' }})
        expect(nameInput.value).toBe('Test Name')
        fireEvent.change(nameInput, { target: { value: '' }})
        fireEvent.blur(nameInput)
        expect(screen.getByText('This field cannot be empty')).toBeInTheDocument()
    })

    test('should validate job input events', () => {
        const jobInput = screen.getByTestId('form_job_input_field') as HTMLInputElement
        fireEvent.change(jobInput, { target: { value: 'Test Job' }})
        expect(jobInput.value).toBe('Test Job')
        fireEvent.change(jobInput, { target: { value: '' }})
        fireEvent.blur(jobInput)
        expect(screen.getByText('This field cannot be empty')).toBeInTheDocument()
    })

    test('should validate both fields when submit button is clicked', async () => {
        const submitButton = screen.getByText('Submit') as HTMLButtonElement
        expect(submitButton).toBeInTheDocument()
        fireEvent.click(submitButton)
        await waitFor(() => {
            expect(screen.getAllByText('This field cannot be empty').length).toBe(2)
        })
        
    })

    test('should call on addUser when input values are valid', async () => {
        const addUser = jest.spyOn(apiModule, "addUser")

        const nameInput = screen.getByTestId('form_name_input_field') as HTMLInputElement
        fireEvent.change(nameInput, { target: { value: 'Test Name' }})
        const jobInput = screen.getByTestId('form_job_input_field') as HTMLInputElement
        fireEvent.change(jobInput, { target: { value: 'Test Job' }})
        const submitButton = screen.getByText('Submit') as HTMLButtonElement
        fireEvent.click(submitButton)
        await waitFor(() => {
            expect(screen.getByTestId('loading_spinner')).toBeInTheDocument()
        })

        expect(addUser).toHaveBeenCalled()
        addUser.mockRestore()
    })
})