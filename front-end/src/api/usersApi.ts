export const getUsers = async () => {
    const res = await fetch("http://localhost:4000/users");
    return await res.json();
};

export const addUser = async (newUser: {
    name: string,
    job: string
}) => {
    const res = await fetch('http://localhost:4000/user/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(newUser)
    })
    return await res.json();
}