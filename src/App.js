import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [showUserList, setShowUserList] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    // Fetch users from the backend server when the component mounts
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = () => {
    const user = users.find(user => user.email === loginInfo.email && user.password === loginInfo.password);
    if (user) {
      setCurrentUser(user);
      setShowUserList(false);
      setShowUserForm(true);
    } else {
      alert('Correo electrónico o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowUserList(true);
    setShowUserForm(false);
  };

  const handleSave = () => {
    // Send a PUT request to the backend server to update the user information
    fetch(`/api/users/${currentUser.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    })
      .then(response => response.json())
      .then(data => {
        setUsers(users.map(user => (user.email === data.email ? data : user)));
        setCurrentUser(data);
        alert('Información guardada correctamente.');
        setShowUserForm(false);
        setShowUserList(true);
      })
      .catch(error => console.error('Error saving user information:', error));
  };

  console.log('Rendering App component');

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-title">
          <h1>Lista de usuarios</h1>
        </div>
        <div className="header-login">
          {currentUser ? (
            <div>
              <h2>Bienvenido, {currentUser.name}</h2>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          ) : (
            <div>
              <h2>Iniciar sesión</h2>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginInfo.email}
                  onChange={handleLoginChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={loginInfo.password}
                  onChange={handleLoginChange}
                />
                <button onClick={handleLogin}>Iniciar sesión</button>
                <Link to="/create-user" onClick={() => setShowUserList(false)}>
                  <button>Crear Usuario</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        {showUserList && (
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                {user.name} - {user.phone} - {user.email} - {user.description}
              </li>
            ))}
          </ul>
        )}
        {showUserForm && currentUser && (
          <div className="user-form">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={currentUser.name}
              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={currentUser.phone}
              onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              disabled
            />
            <input
              type="text"
              name="description"
              placeholder="Descripción"
              value={currentUser.description}
              onChange={(e) => setCurrentUser({ ...currentUser, description: e.target.value })}
            />
            <button onClick={handleSave}>Guardar</button>
          </div>
        )}
      </main>
      <Routes>
        <Route path="/create-user" element={<CreateUser users={users} setUsers={setUsers} setShowUserList={setShowUserList} />} />
      </Routes>
    </div>
  );
}

function CreateUser({ users, setUsers, setShowUserList }) {
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', description: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.password) {
      alert('El correo electrónico y la contraseña son obligatorios.');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      alert('Ya existe una cuenta con este correo electrónico.');
      return;
    }

    // Send a POST request to the backend server to create a new user
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(response => response.json())
      .then(data => {
        setUsers([...users, data]);
        setNewUser({ name: '', phone: '', email: '', description: '', password: '' });
        setShowUserList(true);
        navigate('/');
      })
      .catch(error => console.error('Error creating user:', error));
  };

  console.log('Rendering CreateUser component');

  return (
    <div>
      <h2>Crear cuenta</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={newUser.phone}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newUser.description}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={handleInputChange}
        />
        <button onClick={handleAddUser}>Crear Usuario</button>
      </div>
    </div>
  );
}

export default App;
