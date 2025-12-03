import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import Sidebar from "@/components/Sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function Agenda() {
	const user = await currentUser();
	const posts = await getPosts();
	const dbUserId = await getDbUserId();

	return (
		<div className="relative">
			{/* Background com imagem e overlay branco */}
			<div
				className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
				style={{ backgroundImage: "url('/images/raphapsi.jpg')" }}
			>
				<div className="absolute inset-0 bg-white/90"></div>
			</div>

			{/* Conteúdo principal */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 p-4">
				{/* Sidebar esquerda */}
				<div className="hidden lg:block lg:col-span-2 sticky top-20">
					<Sidebar />
				</div>

				{/* Feed de posts */}
				<div className="lg:col-span-6 space-y-6">
					{user ? <CreatePost /> : null}

					{posts.map((post) => (
						<PostCard key={post.id} post={post} dbUserId={dbUserId} />
					))}
				</div>

				{/* Sidebar direita */}
				<div className="hidden lg:block lg:col-span-4 sticky top-20">
					<WhoToFollow />
				</div>
			</div>
		</div>
	);
}
