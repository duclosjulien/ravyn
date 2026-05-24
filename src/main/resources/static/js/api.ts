import { User } from './types';

async function userLogin(username: string): Promise<User> {
    const response = await fetch("/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: username })
    });
    const user = await response.json();
    return user as User;
}