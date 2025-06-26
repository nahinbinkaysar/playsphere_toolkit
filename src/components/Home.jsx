import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { StartProcess } from "./StartProcess";

export function Home() {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	useEffect(() => {
		if (!username) navigate("/login");
		else navigate("/dashboard");
	}, [])

	function logoutClick() {
		localStorage.removeItem('username');
		toast.success("Logged out successfully");
		navigate("/login");
	}

	return <>
	asd
	</>
}