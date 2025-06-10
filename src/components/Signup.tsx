import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function signUpNewUser() {
		await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: "http://localhost:5173/",
			},
		});
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		signUpNewUser();
	};

	return (
		<div className='p-4 max-w-sm mx-auto border rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Registar</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<Label htmlFor='email' className='block text-sm font-medium mb-1'>
						Email
					</Label>
					<Input type='email' id='email' className='w-full p-2 border rounded mb-2' value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Label htmlFor='password' className='block text-sm font-medium mb-1'>
						Password
					</Label>
					<Input type='password' id='password' className='w-full p-2 border rounded' value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>

				<Button variant='default' type='submit'>
					Registar
				</Button>
			</form>
		</div>
	);
};
