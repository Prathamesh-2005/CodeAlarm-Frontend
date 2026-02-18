import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import axios from "axios";
import "./SystemDesign.css";
import { useNavigate, useParams } from "react-router-dom";

export const SystemDesign = () => {
	const [chapters, setChapters] = useState([]);
	const [chapterContent, setChapterContent] = useState(null);
	const [activeChapter, setActiveChapter] = useState(null);
	const [activeSubSection, setActiveSubSection] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
	const [loading, setLoading] = useState(true);
	const containerRef = React.useRef(null);
	const navigate = useNavigate();
	const { slug } = useParams();

	useEffect(() => {
		const fetchChapters = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					"/api/nextleet/api/system-design/chapters"
				);
				setChapters(response.data.data || []);
			} catch (error) {
				console.error("Error fetching chapters:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchChapters();
		if (slug) {
			setActiveChapter(slug);
		}
	}, [slug]);

	useEffect(() => {
		const fetchChapterContent = async () => {
			if (!activeChapter) return;
			try {
				const response = await axios.get(
					`/api/nextleet/api/system-design/chapters/${activeChapter}`
				);
				setChapterContent(response.data.data);
				if (response.data.data?.sections?.length > 0) {
					setActiveSubSection(response.data.data.sections[0].slug);
				}
			} catch (error) {
				console.error("Error fetching chapter content:", error);
			}
		};
		fetchChapterContent();
	}, [activeChapter]);

	const toggleChapter = (slug) => {
		setActiveChapter((prev) => (prev === slug ? null : slug));
		const mainDocument = document.querySelector(".system-design-content");
		if (mainDocument) {
			mainDocument.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const scrollToSection = (slug) => {
		const container = document.querySelector(".system-design-content");
		const sectionEl = document.getElementById(slug);
		setActiveSubSection(slug);

		if (!container || !sectionEl) return;

		const doScroll = () => {
			const containerRect = container.getBoundingClientRect();
			const sectionRect = sectionEl.getBoundingClientRect();
			const top = sectionRect.top - containerRect.top + container.scrollTop;
			container.scrollTo({ top, behavior: "smooth" });
		};

		doScroll();
		setTimeout(doScroll, 300);
	};

	return (
		<div className="system-design-container min-h-screen bg-gray-950 text-white">
			{/* Sidebar Toggle Button */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className="fixed top-[4.5rem] left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all shadow-lg lg:hidden"
			>
				{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			<div className="flex h-screen pt-16">
				{/* Sidebar */}
				<aside
					className={`system-design-sidebar fixed lg:static top-16 bottom-0 left-0 z-40 w-72 overflow-y-auto transition-transform duration-300 ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				>
					<div className="p-4">
						<h2 className="text-xl font-bold mb-4 gradient-text">System Design</h2>
						{loading ? (
							<div className="flex justify-center items-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
							</div>
						) : (
							<nav className="space-y-2">
								{chapters.map((chapter, idx) => (
									<div key={chapter.slug} className="space-y-1">
										<button
											onClick={() => {
												toggleChapter(chapter.slug);
												navigate(`/system-design/${chapter.slug}`);
											}}
											className={`w-full flex items-center justify-between gap-2 text-left px-4 py-3 rounded-lg transition-all ${
												activeChapter === chapter.slug
													? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg"
													: "hover:bg-gray-900/80 hover:text-white text-gray-400"
											}`}
										>
											<div className="flex gap-2">
												<span className="font-bold text-gray-400">{idx + 1}.</span>
												<span className="text-sm">{chapter.title}</span>
											</div>
											{activeChapter === chapter.slug ? (
												<ChevronUp size={16} className="text-gray-400" />
											) : (
												<ChevronDown size={16} className="text-gray-500" />
											)}
										</button>

										{/* Subsections */}
										{activeChapter === chapter.slug && chapter.sections && (
											<div className="ml-6 border-l border-gray-800 pl-3 space-y-1">
												{chapter.sections.map((section) => (
													<button
														key={section.slug}
														onClick={() => scrollToSection(section.slug)}
														className={`w-full text-left block rounded-lg px-4 py-2 text-sm transition-all ${
															activeSubSection === section.slug
																? "bg-gray-800 text-white shadow-inner"
																: "hover:bg-gray-900/70 hover:text-white text-gray-400"
														}`}
													>
														{section.heading}
													</button>
												))}
											</div>
										)}
									</div>
								))}
							</nav>
						)}
					</div>
				</aside>

				{/* Main Content */}
				<main
					className="system-design-content flex-1 px-5 md:p-8 overflow-y-auto relative chapter-body"
					ref={containerRef}
				>
					{chapterContent ? (
						<div className="w-full">
							{chapterContent.sections?.map((section) => {
								// Fix all relative image paths to use correct domain
								const fixedContent = section.content
									.replace(/src="images\//g, 'src="https://nextleet.com/images/')
									.replace(/src='images\//g, "src='https://nextleet.com/images/");
								
								return (
									<div key={section.slug} className="w-full mb-4 relative">
										<div
											id={section.slug}
											className="chapter"
											dangerouslySetInnerHTML={{
												__html: fixedContent,
											}}
										/>
										<AskAi slug={section.slug} />
									</div>
								);
							})}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
							<p className="text-lg">
								This Notes is from{" "}
								<i className="text-gray-300">
									System Design Interview – An insider's guide by Alex Xu
								</i>
							</p>
							<p className="mt-4 text-sm">Select a chapter from the sidebar to start learning</p>
						</div>
					)}
				</main>
			</div>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
};

const AskAi = ({ slug }) => {
	const handleClick = () => {
		const section = document.getElementById(slug);
		if (section) {
			const context = section.innerText;
			const prompt = `Explain the system design concept in brief: ${context}`;
			const encoded = encodeURIComponent(prompt);
			window.open(
				`https://chat.openai.com/?hints=think&prompt=${encoded}`,
				"_blank"
			);
		}
	};

	return (
		<button
			onClick={handleClick}
			className="flex items-center text-sm justify-center rounded-full text-white bg-neutral-800/90 px-3 py-2 transition-all duration-300 ease-in-out absolute top-5 right-5 cursor-pointer border border-neutral-700 hover:bg-neutral-700/90 shadow-md shadow-black/40"
			title="Ask ChatGPT"
		>
			<svg
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="w-4 h-4"
			>
				<title>OpenAI</title>
				<path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"></path>
			</svg>
			<span className="ml-2 hidden md:inline">Ask AI</span>
		</button>
	);
};

export default SystemDesign;
