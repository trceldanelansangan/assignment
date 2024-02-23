import { SyntheticEvent, memo, useContext, useEffect, useState } from "react"
import "./NewUserForm.css";
import { addUser } from "../../api/usersApi";
import { UserContext } from "../../store/userContext";
import Loader from "../Loader/Loader";

interface NewUserData {
    name: string
    job: string
    fieldError: {
        name: string,
        job: string
    }
}

const userDataInitialState = {
    name: '',
    job: '',
    fieldError: {
        name: '',
        job: ''
    }
}

function NewUserForm() {

    const FIELD_ERROR_MESSAGE = 'This field cannot be empty';

    const { addNewUser } = useContext(UserContext)
    const [userData, setUserData] = useState<NewUserData>(userDataInitialState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState(null)

    useEffect(() => {
        if (isSubmitting) {

            const add = async () => {
                const response = await addUser({
                    name: userData.name,
                    job: userData.job
                })

                if (response.errorMessage) {
                    setApiError(response.errorMessage)
                } else {
                    addNewUser({
                        id: response.id,
                        name: response.name,
                        job: response.job
                    })
                    setUserData(userDataInitialState)
                    setApiError(null)
                }
                setIsSubmitting((prevState) => !prevState)
            }
            add()
        }
    }, [isSubmitting])

    const setFieldError = (fieldName: string, errorMessage: string) => {
        setUserData((prevState) => ({
            ...prevState,
            fieldError: {
                ...prevState.fieldError,
                [fieldName] : errorMessage
            }
        }))
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
            fieldError: {
                ...prevState.fieldError,
                [name] : ''
            }
        }))
        setApiError(null)
    }

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        const errorText = !value && value.trim().length === 0 ? FIELD_ERROR_MESSAGE : ''
        setFieldError(name, errorText);
    }

    const onFormSubmit = (event: SyntheticEvent) => {
        event.preventDefault()

        if (userData.name.trim() === '') {
            setFieldError('name', FIELD_ERROR_MESSAGE);
        }
        if (userData.job.trim() === '') {
            setFieldError('job', FIELD_ERROR_MESSAGE);
        }

        if (userData.name.trim() !== '' && userData.job.trim() !== '') {
            setIsSubmitting((prevState) => !prevState)
        }
    }

    return (
        <div data-testid="add_user_form" className="container">
            {isSubmitting && <Loader />}
            <h2>Add New User</h2>
            <form onSubmit={onFormSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        data-testid="form_name_input_field" 
                        type="text" 
                        name="name" 
                        value={userData.name}
                        maxLength={50}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur}
                        disabled={isSubmitting} />
                        
                    {userData.fieldError.name.trim() && 
                    <>
                        <label className="fieldErrorMessage">{userData.fieldError.name}</label>
                    </>
                    }
                </div>
                <div>
                    <br/>
                    <label>Job</label>
                    <input 
                        data-testid="form_job_input_field"
                        type="text" 
                        name="job" 
                        value={userData.job}
                        maxLength={30} 
                        onChange={handleOnChange}
                        onBlur={handleOnBlur}
                        disabled={isSubmitting} />
                    {userData.fieldError.job.trim() && 
                        <label className="fieldErrorMessage">{userData.fieldError.job}</label>
                    }
                </div>
                {apiError && 
                <>
                    <br/>
                    <label className="fieldErrorMessage">{apiError}</label>
                    <br/>
                </>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default memo(NewUserForm)