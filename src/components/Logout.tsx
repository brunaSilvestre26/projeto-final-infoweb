import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase";

export const Logout = () => {
	const handleLogout = async (e: React.FormEvent) => {
		e.preventDefault();
		await supabase.auth.signOut();
	};

	return (
		<div className='p-4 max-w-sm mx-auto border rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Logout</h2>

			<Button variant='default' type='submit' onClick={handleLogout}>
				Logout
			</Button>
		</div>
	);
};
