import React from 'react'

function Register() {
  return (
    <section>
      <form>
        <div>
        <span>username:---</span>
        <input type="text" placeholder="username" />
        </div>
        <div>
        <span>firstName:---</span>
        <input type="text" placeholder="firstName" />
        </div>
        <div>
        <span>lastName:---</span>
        <input type="text" placeholder="lastName" />
        </div>
        <div>
        <span>Email:---</span>
        <input type="email" placeholder="email" />
        </div>
        <div>
        <span>Password:---</span>
        <input type="password" placeholder="password" />
        </div>
        <button type="submit">Register</button>
      </form>
    </section>
    
  );
}

export default Register