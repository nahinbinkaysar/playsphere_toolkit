import { Button } from "@mui/material";
import toast from "react-hot-toast";

export function PrintCustomer({ name, phone, cususername, cuspassword, payment, trx, date }) {
	return (
		<tr>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{name}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{phone}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{cususername}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{cuspassword}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{payment}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{trx}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{date}</td>
			<td style={{ border: "1px solid #ccc", padding: "6px" }}>{payment ? "Yes" : "No"}</td>
		</tr>
	);
}