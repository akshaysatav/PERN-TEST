// import React, { useEffect, useState } from "react";

// function App() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/users")
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch((err) => console.error("Error:", err));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Users List</h1>

//       {users.length === 0 ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {users.map((user) => (
//             <li key={user.id}>
//               {user.full_name} — {user.email}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";

function App() {
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState({
		full_name: "",
		email: "",
		password: "",
	});

	const fetchUsers = () => {
		fetch("http://localhost:5000/api/users")
			.then((res) => res.json())
			.then((data) => setUsers(data))
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		await fetch("http://localhost:5000/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form),
		});

		setForm({ full_name: "", email: "", password: "" });
		fetchUsers();
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>PERN Stack Users</h1>

			<form onSubmit={handleSubmit}>
				<input
					placeholder="Full Name"
					value={form.full_name}
					onChange={(e) => setForm({ ...form, full_name: e.target.value })}
				/>
				<input
					placeholder="Email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
				/>
				<input
					placeholder="Password"
					type="password"
					value={form.password}
					onChange={(e) => setForm({ ...form, password: e.target.value })}
				/>
				<button type="submit">Add User</button>
			</form>

			<h2>Users List</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.full_name} — {user.email}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
