import isAuthenticated from "@/hooks/isAutheticated";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const authenticated = await isAuthenticated();
		if (!authenticated) {
			throw redirect({
				to: "/login",
				replace: true,
			});
		}
	},
});
