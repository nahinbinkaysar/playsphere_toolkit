import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // MUI icon (optional)



export function StartProcess({ onClose, name, email, licenseKey, phone, cususername, cuspassword, payment, trx, date, fb, customerId }) {

	const [fbState, setFB] = useState(fb || "");
	const [phoneState, setPhone] = useState(phone || "");
	const [cususernameState, setCusUsername] = useState(cususername || "");
	const [cuspasswordState, setCusPassword] = useState(cuspassword || "");
	const [paymentState, setPayment] = useState(payment || "");
	const [trxState, setTrx] = useState(trx || "");
	const [dateState, setDate] = useState(date || "");

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [zip, setZip] = useState("");

	const [bkashMessage, setBkashMessage] = useState("");
	
	
	const [verification, setVerification] = useState("tmr mail ekta verification link gese, ekta blue box paba, oitay touch and hold kore copy korba, oita amake dao, oi link e tmi dhuiko na");
	const [done, setDone] = useState("");


	// Update state if props change (for edit mode)
	useEffect(() => { if (fb) setFB(fb); }, [fb]);
	useEffect(() => { if (phone) setPhone(phone); }, [phone]);
	useEffect(() => { if (cususername) setCusUsername(cususername); }, [cususername]);
	useEffect(() => { if (cuspassword) setCusPassword(cuspassword); }, [cuspassword]);
	useEffect(() => { if (payment) setPayment(payment); }, [payment]);
	useEffect(() => { if (trx) setTrx(trx); }, [trx]);
	useEffect(() => { if (date) setDate(date); }, [date]);

	async function addCustomer() {
		const body = {
			"facebook_id": fbState,
			"email": email,
			"license_key": licenseKey,
			"name": name,
			"phone": phoneState,
			"username": cususernameState,
			"password": cuspasswordState,
			"payment": paymentState,
			"transaction_id": trxState,
			"date": dateState
		};
		let r, j;
		if (customerId) {
			r = await fetch(`http://localhost:8000/customer/${customerId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			j = await r.json();
			toast.success("customer updated");
		} else {
			r = await fetch("http://localhost:8000/customer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			j = await r.json();
			toast.success("customer added");
		}
		onClose();
	}

	function Draggy({ state }) {
		return <span
			draggable
			onDragStart={e => e.dataTransfer.setData("text/plain", state)}
			style={{ cursor: "grab", userSelect: "none", padding: "4px", border: "1px dashed #aaa" }} >
			<input readOnly type="text" label='full name' value={state} />

		</span>
	}


	function CopyableParagraph({ text }) {
		const handleCopy = () => {
			navigator.clipboard.writeText(text);
			toast.success("Copied!");
		};

		return (
			<div style={{ display: "flex", alignItems: "center" }}>
				<p style={{ marginRight: 8 }}>{text}</p>
				<Button onClick={handleCopy} size="small" variant="outlined">
					<ContentCopyIcon fontSize="small" />
				</Button>
			</div>
		);
	}
	async function fetchAddress() {
		try {
			const res = await fetch("http://localhost:8000/address/next");
			if (!res.ok) throw new Error("No unused addresses left or server error");
			const data = await res.json();
			setStreet(data.street);
			setCity(data.city);
			setProvince(data.province);
			setZip(data.zip);
		} catch (err) {
			toast.error(err.message);
		}
	}

	useEffect(() => {
		fetchAddress();
	}, []);

	useEffect(() => {
		if (name) {
			const generatedUsername = name
				.replace(/\s+/g, "_")
				.replace(/[^A-Za-z_]/g, "")
				.toLowerCase();
			setCusUsername(generatedUsername);

			const parts = name.trim().split(/\s+/);
			const first = (parts[0] || "").replace(/[^A-Za-z]/g, "");
			setFirstName(first);

			const rest = parts.slice(1).join(" ").replace(/[^A-Za-z\s]/g, "");
			setLastName(rest);

			setCusPassword(first.toLowerCase() + "_$ph3r3");

		}
	}, [name]);

	useEffect(() => {
		let doneee = "done \nid: " + cususernameState + " \npass: " + cuspasswordState;
		setDone(doneee);
	}, [cususernameState, cuspasswordState]);

	function extractBkashData(message) {
		// Regex for: amount, phone, trx, date
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
		if (trx) setTrx(trx);
		if (date) setDate(date);
	}

	// toast.success("Logged out successfully");
	return <>

		<TextField slotProps={{ input: { readOnly: true, }, }} label='full name' value={name} />
		<TextField slotProps={{ input: { readOnly: true, }, }} label='email' value={email} />
		<TextField slotProps={{ input: { readOnly: true, }, }} label='key' value={licenseKey} />

		<h1> 1 </h1>
		<a href="https://store.steampowered.com/join/?">create steam acc</a>

		<p> email {" "} <Draggy state={email} /></p>

		<CopyableParagraph text={verification} />

		<p> -- wait for verification -- </p>

		<p></p>

		<h1> 2 </h1>

		<TextField label='username' value={cususernameState} onChange={e => setCusUsername(e.target.value)} />
		<TextField label='password' value={cuspasswordState} onChange={e => setCusPassword(e.target.value)} />

		<p>username {" "}<Draggy state={cususernameState} /></p>
		<p>password {" "}<Draggy state={cuspasswordState} /></p>

		<h1> 3 </h1>
		<a href="https://store.steampowered.com/account/redeemwalletcode">redeem</a>

		<p> key {" "} <Draggy state={licenseKey} /></p>

		<h1> 4 </h1>

		<p> Street {" "} <Draggy state={street} />
			{" "} city {" "} <Draggy state={city} />
			{" "} province {" "} <Draggy state={province} />
			{" "} zip {" "} <Draggy state={zip} /> </p>

		<h1> 5 </h1>
		<a href="https://store.steampowered.com/app/2669320/EA_SPORTS_FC_25/">fc 25</a>

		<p>
			first name {" "}
			<Draggy state={firstName} />
			{" "}last name{" "}
			<Draggy state={lastName} />
		</p>

		<p> Street {" "} <Draggy state={street} />
			{" "} city {" "} <Draggy state={city} />
			{" "} province {" "} <Draggy state={province} />
			{" "} zip {" "} <Draggy state={zip} /> </p>

		<h1> 6 </h1>
		<TextField label='bKash message' multiline maxRows={4} value={bkashMessage} onChange={handleBkashMessageChange} />

		<CopyableParagraph text={done} />


		<div style={{ fontSize: '40px', textAlign: 'center' }}>Login</div>
		<Button onClick={addCustomer} variant="contained" color="primary">{customerId ? "Update Customer" : "Add Customer"}</Button>

	</>
}