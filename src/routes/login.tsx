import { Login } from "@/components/Login";
import { Logout } from "@/components/Logout";
import { Signup } from "@/components/Signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className='mt-10'>
			<Login />
			<Signup />
			<Logout />
		</div>
	);
}
