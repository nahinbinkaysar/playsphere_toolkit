import { Button, TextField, IconButton } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export function StartProcess({ onClose, customerId }) {

	const [facebook_id, setFacebookId] = useState("");
	const [email, setEmail] = useState("");
	const [license_key, setLicenseKey] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [cusUsername, setCusUsername] = useState("");
	const [cusPassword, setCusPassword] = useState("");
	const [payment, setPayment] = useState("");
	const [transaction_id, setTransactionID] = useState("");
	const [date, setDate] = useState("");

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [zip, setZip] = useState("");


	const [bkashMessage, setBkashMessage] = useState("");
	const [verification] = useState("tmr mail ekta verification link gese, ekta blue box paba, oitay touch and hold kore copy korba, oita amake dao, oi link e tmi dhuiko na");
	
	const [bKashNahin] = useState("01715149756 ei number e 375tk Bkash e send money koro, reference e( name ) must dio\nif possible please provide cash-out charge");
	const [bKashRadid] = useState("01727831601 ei number e 375tk Bkash e send money koro, reference e( name ) must dio\nif possible please provide cash-out charge");
	const [bKashSheshir] = useState("01727831601 ei number e 375tk Bkash e send money koro, reference e( name ) must dio\nif possible please provide cash-out charge");
	
	const [csb] = useState("https://www.facebook.com/share/p/191rFy4BeG/ \nCsb post e done likhe diyo, track rakhte subidha hbe");


	const [done, setDone] = useState("");
	const [numAddresses, setNumAddresses] = useState(0);

	useEffect(() => {
		console.log(customerId);
		if (customerId) {
			fetch(`${API_BASE_URL}/customer/${customerId}`)
				.then(res => {
					if (!res.ok) throw new Error("Customer not found");
					return res.json();
				})
				.then(data => {
					setFacebookId(data.facebook_id || "");
					setEmail(data.email || "");
					setLicenseKey(data.license_key || "");
					setName(data.name || "");
					setPhone(data.phone || "");
					if (data.username) setCusUsername(data.username);
					if (data.password) setCusPassword(data.password);
					setPayment(data.payment || "");
					setTransactionID(data.transaction_id || "");
					setDate(data.date || "");
				})
				.catch(err => toast.error(err.message));
		}
	}, [customerId]);

	useEffect(() => {
		if (name) {
			const generatedUsername = name.replace(/\s+/g, "_").replace(/[^A-Za-z_]/g, "").toLowerCase();
			// console.log(cusUsername);
			if(cusUsername == "") setCusUsername(generatedUsername);
			const parts = name.trim().split(/\s+/);
			const first = (parts[0] || "").replace(/[^A-Za-z]/g, "");
			if(firstName == "") setFirstName(first);
			const rest = parts.slice(1).join(" ").replace(/[^A-Za-z\s]/g, "");
			if(lastName == "") setLastName(rest);
			if(cusPassword == "") setCusPassword(first.toLowerCase() + "Sph3r3");
		}
	}, [name]);

	useEffect(() => {
		setDone(`done\nid: ${cusUsername}\npass: ${cusPassword}`);
	}, [cusUsername, cusPassword]);

	useEffect(() => {
		document.title = name ? name : "Start Process";
	}, [name]);

	useEffect(() => {
		async function fetchNumAddresses() {
			try {
				const res = await fetch(`${API_BASE_URL}/customers`); // dummy fetch to get address count
				const addrRes = await fetch(`${API_BASE_URL}/address/by-index/0`);
				if (addrRes.status === 404) {
					setNumAddresses(0);
					return;
				}
				// Try to find the number of addresses by incrementing index until 404
				let count = 0;
				while (true) {
					const res = await fetch(`${API_BASE_URL}/address/by-index/${count}`);
					if (!res.ok) break;
					count++;
				}
				setNumAddresses(count);
			} catch (err) {
				setNumAddresses(0);
			}
		}
		fetchNumAddresses();
	}, []);

	useEffect(() => {
		async function fetchAddressForCustomer() {
			if (customerId && numAddresses > 0) {
				const index = (customerId - 1) % numAddresses;
				try {
					const res = await fetch(`${API_BASE_URL}/address/by-index/${index}`);
					if (!res.ok) throw new Error("Address not found");
					const data = await res.json();
					setStreet(data.street);
					setCity(data.city);
					setProvince(data.province);
					setZip(data.zip);
				} catch (err) {
					setStreet(""); setCity(""); setProvince(""); setZip("");
				}
			}
		}
		fetchAddressForCustomer();
	}, [customerId, numAddresses]);

	async function updateCustomer() {
		const body = {
			facebook_id,
			email,
			license_key,
			name,
			phone,
			username: cusUsername,
			password: cusPassword,
			payment,
			transaction_id,
			date,
		};
		let r, j;
		r = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
		j = await r.json();
		toast.success("customer updated");

		onClose();
	}

	function Draggy({ state, setState, label }) {
		return (

			<div style={{ display: "flex", alignItems: "center" }}>
				<TextField
					draggable
					onDragStart={e => e.dataTransfer.setData("text/plain", state)} label={label}
					value={state}
					style={{ cursor: "grab", userSelect: "none", padding: "4px" }}
					onChange={(e) => setState(e.target.value)} />
				<CopyableParagraph text={state} />
			</div>

		);
	}

	function CopyableParagraph({ text }) {
		const handleCopy = () => {
			navigator.clipboard.writeText(text);
			toast.success("Copied!");
		};
		return (
			<IconButton onClick={handleCopy} aria-label="copy" size="small">
				<ContentCopyIcon fontSize="inherit" />
			</IconButton>

		);
	}

	function extractBkashData(message) {
		const regex = /received Tk ([\d.]+) from (\d+).*?TrxID (\w+) at ([\d\/ :]+)/i;
		const match = message.match(regex);
		if (match) {
			return {
				payment: match[1],
				phone: match[2],
				trx: match[3],
				date: match[4]
			};
		}
		return {};
	}

	function handleBkashMessageChange(e) {
		const msg = e.target.value;
		setBkashMessage(msg);
		const { payment, phone, trx, date } = extractBkashData(msg);
		if (payment) setPayment(payment);
		if (phone) setPhone(phone);
		if (trx) setTransactionID(trx); // fix: setTransactionID, not setTrx
		if (date) setDate(date);
	}

	return (
		<>
			<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				<h1> init </h1>
				<TextField label='full name' value={name} onChange={(e) => setName(e.target.value)} />
				<TextField label='email' value={email} onChange={(e) => setEmail(e.target.value)} />
				<TextField label='key' value={license_key} onChange={(e) => setLicenseKey(e.target.value)} />

				<h1> 1 </h1>
				<p><a href="https://store.steampowered.com/join/?">create steam acc</a></p>
				<Draggy state={email} setState={setEmail} label={"email"} />
				<p> -- wait for verification -- </p>

				<p>{verification}
				<CopyableParagraph text={verification} /> </p>



				<h1> 2 </h1>
				<Draggy state={cusUsername} setState={setCusUsername} label={"username"} />
				<Draggy state={cusPassword} setState={setCusPassword} label={"password"} />

				<h1> 3 </h1>
				<p><a href="https://store.steampowered.com/account/redeemwalletcode">redeem</a></p>
				<Draggy state={license_key} setState={setLicenseKey} label={"license_key"} />


				<h1> 4 </h1>

				<Draggy state={street} setState={setStreet} label={"street"} />
				<Draggy state={city} setState={setCity} label={"city"} />
				<Draggy state={province} setState={setProvince} label={"province"} />
				<Draggy state={zip} setState={setZip} label={"zip"} />

				<h1> 5 </h1>
				<p><a href="https://store.steampowered.com/app/2669320/EA_SPORTS_FC_25/">fc 25</a></p>

				<Draggy state={firstName} setState={setFirstName} label={"firstName"} />
				<Draggy state={lastName} setState={setLastName} label={"lastName"} />

				<Draggy state={street} setState={setStreet} label={"Billing address"} />
				<Draggy state={city} setState={setCity} label={"city"} />
				<Draggy state={province} setState={setProvince} label={"province"} />
				<Draggy state={zip} setState={setZip} label={"zip"} />


				<h1> 6 </h1>

				<p>{bKashNahin}
				<CopyableParagraph text={bKashNahin} /> </p>

				<p>{bKashRadid}
				<CopyableParagraph text={bKashRadid} /> </p>

				<p>{bKashSheshir}
				<CopyableParagraph text={bKashSheshir} /> </p>

				

				<TextField label='bKash message' multiline maxRows={4} value={bkashMessage} onChange={handleBkashMessageChange} />
				{/* <Draggy state={bkashMessage} setState={setBkashMessage} label={"bkashMessage"} /> */}


				<p>{done}
				<CopyableParagraph text={done} /> </p>

				
				<p>{csb}
				<CopyableParagraph text={csb} /> </p>



				<Button onClick={updateCustomer} variant="contained" color="primary">{customerId ? "Update Customer" : "Add Customer"}</Button>
				{customerId && (
					<Button
						variant="outlined"
						color="error"
						onClick={async () => {
							if (window.confirm(`Delete customer ${name || email || customerId}?`)) {
								try {
									const res = await fetch(`${API_BASE_URL}/customer/${customerId}`, { method: 'DELETE' });
									if (!res.ok) throw new Error('Failed to delete');
									toast.success('Customer deleted');
									onClose();
								} catch (err) {
									toast.error(err.message);
								}
							}
						}}
						style={{ marginTop: 8 }}
					>
						Delete Customer
					</Button>
				)}
			</div >

		</>
	);
}