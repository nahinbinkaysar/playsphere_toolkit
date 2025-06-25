import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material";
import Box from '@mui/material/Box'
// import { CreateTodoModal } from "./CreateTodoModal";
import toast from "react-hot-toast";
import { PrintCustomer } from "./PrintCustomer";
import { StartProcess } from "./StartProcess";

export function Dashboard() {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	const [customerList, setCustomerList] = useState([]);
	const [search, setSearch] = useState("");

	const [showStartProcess, setShowStartProcess] = useState(false);
	const [editCustomer, setEditCustomer] = useState(null);

	const [fb, setFB] = useState("");
	const [email, setEmail] = useState("");
	const [licenseKey, setLicenseKey] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [cususername, setCusUsername] = useState("");
	const [cuspassword, setCusPassword] = useState("");
	const [payment, setPayment] = useState("");
	const [trx, setTrx] = useState("");
	const [date, setDate] = useState("");

	async function getCustomers() {
		const r = await fetch("http://localhost:8000/customers");
		const j = await r.json();
		setCustomerList(j);
		console.log(j);
	}

	useEffect(() => {
		if (!username) {
			navigate("/login");
		}
		getCustomers();
	}, [])

	function logoutClick() {
		localStorage.removeItem('username');
		toast.success("Logged out successfully");
		navigate("/login");
	}

	

	return <>
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }} >
			<div style={{ width: "500px" }}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h1>Welcome, {username}!</h1>
					<div>
						<Button onClick={logoutClick} variant="outlined" color="error">Logout</Button>
					</div>
				</div>

				{!showStartProcess && (
					<>
						<div style={{ display: "flex column", backgroundColor: "white", padding: "20px" }}>
							<div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", padding: "20px" }}>
								<h1>new</h1>
								<TextField variant="filled" label='full name' required value={name} onChange={(e) => setName(e.target.value)} />
								<TextField variant="filled" label='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
								<TextField variant="filled" label='key' required value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />

								<Button onClick={() => setShowStartProcess(true)} fullWidth variant="contained" size="large" >Start</Button>
							</div>
						</div>
					</>
				)}

				{(showStartProcess || editCustomer) && <StartProcess
					onClose={() => {
						setShowStartProcess(false);
						setEditCustomer(null);
						getCustomers(); // Refresh list after closing modal
					}}
					name={editCustomer ? editCustomer.name : name}
					email={editCustomer ? editCustomer.email : email}
					licenseKey={editCustomer ? editCustomer.license_key : licenseKey}
					phone={editCustomer ? editCustomer.phone : phone}
					cususername={editCustomer ? editCustomer.username : cususername}
					cuspassword={editCustomer ? editCustomer.password : cuspassword}
					payment={editCustomer ? editCustomer.payment : payment}
					trx={editCustomer ? editCustomer.transaction_id : trx}
					date={editCustomer ? editCustomer.date : date}
					fb={editCustomer ? editCustomer.facebook_id : fb}
					customerId={editCustomer ? editCustomer.id : undefined}
				/>}

				<div style={{ padding: "10px" }}>
					<TextField fullWidth placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
				<div>
					<table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
						<thead>
							<tr>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Name</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Number</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Username</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Password</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Payment</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>TrxID</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Date</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Paid on</th>
								<th style={{ border: "1px solid #ccc", padding: "6px" }}>Edit</th>
							</tr>
						</thead>
						<tbody>
							{
								customerList.map((value, index) => {
									if (value.name && value.name.toLowerCase().includes(search.toLowerCase())) {
										return (
											<tr key={index} style={{ background: value.payment ? '#b6fcb6' : undefined }}>
												<td>{value.name}</td>
												<td>{value.phone}</td>
												<td>{value.username}</td>
												<td>{value.password}</td>
												<td>{value.payment}</td>
												<td>{value.transaction_id}</td>
												<td>{value.date}</td>
												<td>{value.paid_on || ''}</td>
												<td>
													<Button size="small" variant="outlined" onClick={() => setEditCustomer(value)}>Edit</Button>
												</td>
											</tr>
										);
									}
									return null;
								})
							}
						</tbody>
					</table>
				</div>

				<br />
				<br />
				{/* <CreateTodoModal updateTodos={getTodos}/> */}

			</div>
		</div>
	</>
}