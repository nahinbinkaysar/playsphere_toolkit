import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { StartProcess } from "./StartProcess";
import { CustomerTable } from "./CustomerTable";

export function Dashboard() {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	const [customerList, setCustomerList] = useState([]);
	const [newCustomerId, setNewCustomerId] = useState(null);
	const [newCustomerData, setNewCustomerData] = useState(null);
	const [showStartProcess, setShowStartProcess] = useState(false);
	const [editCustomer, setEditCustomer] = useState(null);
	const [email, setEmail] = useState("");
	const [licenseKey, setLicenseKey] = useState("");
	const [name, setName] = useState("");

	async function fetchCustomers() {
		try {
			const r = await fetch("http://localhost:8000/customers");
			const j = await r.json();
			setCustomerList(j);
		} catch (err) {
			console.error("Failed to fetch customers", err);
		}
	}

	useEffect(() => {
		if (!username) {
			navigate("/login");
		} else {
			fetchCustomers();
		}
	}, [])

	// Fetch the new customer data by id when newCustomerId changes
	useEffect(() => {
		if (newCustomerId) {
			fetch(`http://localhost:8000/customer/${newCustomerId}`)
				.then(res => {
					if (!res.ok) throw new Error("Customer not found");
					return res.json();
				})
				.then(data => setNewCustomerData(data))
				.catch(err => toast.error(err.message));
		}
	}, [newCustomerId]);

	async function addCustomer() {
		const body = { email, license_key: licenseKey, name };
		try {
			const r = await fetch("http://localhost:8000/customer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			const j = await r.json();
			if (!r.ok) throw new Error(j.detail || "Failed to add customer");
			toast.success("customer added");
			fetchCustomers();
			setEmail("");
			setLicenseKey("");
			setName("");
			setNewCustomerId(j.id); // store the new id

			// Fetch the full customer object by id and store it
			const customerRes = await fetch(`http://localhost:8000/customer/${j.id}`);
			const customerObj = await customerRes.json();
			setNewCustomerData(customerObj);

			setShowStartProcess(true);
		} catch (err) {
			toast.error(err.message);
		}
	}

	function logoutClick() {
		localStorage.removeItem('username');
		toast.success("Logged out successfully");
		navigate("/login");
	}

	return <>
		<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
			<div style={{ width: "500px" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<h2>Welcome, {username}!</h2>
					<Button onClick={logoutClick} variant="outlined" color="error">Logout</Button>
				</div>

				{!showStartProcess && (
					<>
						<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
							<h3>create new customer</h3>
							<TextField label='full name' value={name} onChange={(e) => setName(e.target.value)} />
							<TextField label='email' value={email} onChange={(e) => setEmail(e.target.value)} />
							<TextField label='key' value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />

							<Button onClick={addCustomer} variant="contained" size="large" >Start</Button>
						</div>
					</>
				)}

				{(showStartProcess || editCustomer) && <StartProcess
					onClose={() => {
						setShowStartProcess(false);
						setEditCustomer(null);
						setNewCustomerId(null);
						setNewCustomerData(null);
						fetchCustomers();
					}}
					customerId={editCustomer ? editCustomer.id : newCustomerId}
					customerData={editCustomer ? editCustomer : newCustomerData}
				/>}

			</div>
			{/* CustomerTable in a scrollable container for responsiveness */}
			<div style={{ overflowX: "auto", maxWidth: "100vw" }}>
				<CustomerTable customerList={customerList} fetchCustomers={fetchCustomers} setEditCustomer={setEditCustomer} />
			</div>
		</div>

	</>
}