import { useState, useEffect } from "react"
import { Button, TextField, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function CustomerTable({ customerList, fetchCustomers, setEditCustomer }) {
	const [search, setSearch] = useState("");

	return (
		<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
			<div style={{ padding: "10px" }}>
				<TextField fullWidth placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>
			<div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw" }}>
				<table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", margin: "16px" }}>
					<thead>
						<tr>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Edit</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Copy</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Name</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Number</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Username</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Password</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Payment</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>TrxID</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Date</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Paid on</th>
							<th style={{ border: "1px solid #ccc", padding: "6px" }}>Delete</th>
						</tr>
					</thead>
					<tbody>
						{customerList.filter(value => value.name && value.name.toLowerCase().includes(search.toLowerCase())).map((value, index) => (
							<tr key={index} style={{ background: value.payment ? '#b6fcb6' : undefined }}>
								<td>
									<IconButton size="small" aria-label="edit" onClick={() => setEditCustomer(value)}>
										<EditIcon fontSize="inherit" />
									</IconButton>
								</td>
								<td>
									<IconButton size="small" aria-label="copy" onClick={() => {
										const rowText = [
											value.name,
											value.phone,
											value.username,
											value.password,
											value.payment,
											value.transaction_id,
											value.date,
											value.paid_on || ''
										].join('\t');
										navigator.clipboard.writeText(rowText);
										toast.success('Row copied!');
									}}>
										<ContentCopyIcon fontSize="inherit" />
									</IconButton>

								</td>
								<td>{value.name}</td>
								<td>{value.phone}</td>
								<td>{value.username}</td>
								<td>{value.password}</td>
								<td>{value.payment}</td>
								<td>{value.transaction_id}</td>
								<td>{value.date}</td>
								<td>{value.paid_on || ''}</td>
								<td>
									<IconButton size="small" color="error" variant="outlined" onClick={async () => {
										if (window.confirm(`Delete customer ${value.name || value.email || value.id}?`)) {
											try {
												const res = await fetch(`${API_BASE_URL}/customer/${value.id}`, { method: 'DELETE' });
												if (!res.ok) throw new Error('Failed to delete');
												toast.success('Customer deleted');
												fetchCustomers();
											} catch (err) {
												toast.error(err.message);
											}
										}
									}}>
										<DeleteIcon fontSize="inherit" />

									</IconButton>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}