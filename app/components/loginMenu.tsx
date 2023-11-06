import React from 'react'

function LoginMenu() {
  return (
    <form>
        <label htmlFor='username'>Username: </label>
        <input type='text' id='username' name='username' />
        <label htmlFor='password'>Password: </label>
        <input type='password' id='password' name='password' />
        <button>Log in</button>
    </form>
  )
}

export default LoginMenu