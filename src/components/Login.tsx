import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase";

export const Login = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await supabase.auth.signInWithOtp({ email });
	};

	return (
		<div className='p-4 max-w-sm mx-auto border rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label htmlFor='email' className='block text-sm font-medium mb-1'>
						Email
					</label>
					<input type='email' id='email' className='w-full p-2 border rounded' value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>

				<Button variant='default' type='submit'>
					Entrar
				</Button>
			</form>
		</div>
	);
};
