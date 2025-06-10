import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className='p-2'>
			<h3 className=''>Welcome Home!</h3>
			<Button variant='default' type='submit'>
				Thanks
			</Button>
		</div>
	);
}
