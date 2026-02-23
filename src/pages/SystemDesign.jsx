import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import axios from "axios";
import "./SystemDesign.css";
import { useNavigate, useParams } from "react-router-dom";

const SUPABASE_URL = 'https://yvnqfabssvyfofoswqjw.supabase.co';
const CHAPTERS_URL = `${SUPABASE_URL}/storage/v1/object/public/system-design-data/chapters/chapters.json`;
const ALL_CHAPTERS_URL = `${SUPABASE_URL}/storage/v1/object/public/system-design-data/chapters/all-chapters.json`;
const IMAGES_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/system-design-images/images/`;

const CONFETTI_COLORS = ['#f97316','#3b82f6','#f59e0b','#10b981','#8b5cf6','#ec4899','#06b6d4','#a3e635','#ff6b6b','#4ecdc4'];

const Confetti = ({ active }) => {
	const [pieces, setPieces] = React.useState([]);
	React.useEffect(() => {
		if (!active) { setPieces([]); return; }
		setPieces(Array.from({ length: 120 }, (_, i) => ({
			id: i,
			left: Math.random() * 100,
			color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
			delay: Math.random() * 0.8,
			duration: 2.5 + Math.random() * 2,
			size: 6 + Math.random() * 8,
			rotate: Math.random() * 360,
			isCircle: Math.random() > 0.5,
		})));
		const t = setTimeout(() => setPieces([]), 5500);
		return () => clearTimeout(t);
	}, [active]);
	return <>
		{pieces.map(p => (
			<div key={p.id} style={{
				position: 'fixed', left: `${p.left}%`, top: '-10px',
				width: p.size, height: p.isCircle ? p.size : p.size * 0.5,
				backgroundColor: p.color, borderRadius: p.isCircle ? '50%' : 2,
				animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
				zIndex: 9999, pointerEvents: 'none',
				transform: `rotate(${p.rotate}deg)`, opacity: 0,
			}} />
		))}
	</>;
};

const Toast = ({ message, emoji, visible }) => (
	<div style={{
		position: 'fixed', bottom: 28, left: '50%',
		transform: `translateX(-50%) translateY(${visible ? 0 : 24}px)`,
		opacity: visible ? 1 : 0,
		transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
		zIndex: 9998, pointerEvents: 'none',
		display: 'flex', alignItems: 'center', gap: 10,
		background: '#0f0f0f',
		border: '1px solid #2a2a2a',
		borderRadius: 12, padding: '12px 20px',
		boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
		fontFamily: '"DM Sans", sans-serif',
		fontSize: 14, fontWeight: 600, color: '#e5e5e5',
		whiteSpace: 'nowrap',
	}}>
		<span style={{
			width: 20, height: 20, borderRadius: '50%',
			background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center',
			flexShrink: 0,
		}}>
			<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
				<path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		</span>
		{message}
	</div>
);

export const SystemDesign = () => {
	const [chapters, setChapters] = useState([]);
	const [allChaptersData, setAllChaptersData] = useState([]);
	const [chapterContent, setChapterContent] = useState(null);
	const [activeChapter, setActiveChapter] = useState(null);
	const [activeSubSection, setActiveSubSection] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
	const [loading, setLoading] = useState(true);
	const [completedChapters, setCompletedChapters] = useState([]);
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [toast, setToast] = useState({ visible: false, message: '' });

	const containerRef = React.useRef(null);
	const navigate = useNavigate();
	const { slug } = useParams();

	const triggerCelebration = (message) => {
		setShowConfetti(true);
		setToast({ visible: true, message });
		setTimeout(() => setShowConfetti(false), 5500);
		setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
	};

	useEffect(() => {
		const saved = localStorage.getItem('completedChapters');
		if (saved) setCompletedChapters(JSON.parse(saved));
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const chaptersResponse = await axios.get(CHAPTERS_URL);
				setChapters(chaptersResponse.data || []);
				const allChaptersResponse = await axios.get(ALL_CHAPTERS_URL);
				setAllChaptersData(allChaptersResponse.data || []);
			} catch (error) {
				console.error("Error fetching chapters:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
		if (slug) setActiveChapter(slug);
	}, [slug]);

	useEffect(() => {
		const container = document.querySelector('.system-design-content');
		if (!container) return;
		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
			if (isBottom && activeChapter && !completedChapters.includes(activeChapter) && !hasScrolledToBottom) {
				setHasScrolledToBottom(true);
				triggerCelebration("You've reached the end!");
			}
			if (chapterContent && chapterContent.sections) {
				const sections = chapterContent.sections;
				let currentSection = sections[0]?.slug;
				for (const section of sections) {
					const element = document.getElementById(section.slug);
					if (element) {
						const rect = element.getBoundingClientRect();
						if (rect.top <= 200 && rect.bottom >= 100) currentSection = section.slug;
					}
				}
				if (currentSection !== activeSubSection) setActiveSubSection(currentSection);
			}
		};
		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [activeChapter, completedChapters, hasScrolledToBottom, chapterContent, activeSubSection]);

	useEffect(() => { setHasScrolledToBottom(false); }, [activeChapter]);

	useEffect(() => {
		const loadChapterContent = () => {
			if (!activeChapter || allChaptersData.length === 0) return;
			const content = allChaptersData.find(ch => ch.slug === activeChapter);
			if (content) {
				setChapterContent(content);
				const mainDocument = document.querySelector(".system-design-content");
				if (mainDocument) mainDocument.scrollTo({ top: 0, behavior: "smooth" });
				if (content.sections?.length > 0) setActiveSubSection(content.sections[0].slug);
			}
		};
		loadChapterContent();
	}, [activeChapter, allChaptersData]);

	const markChapterComplete = (chapterSlug) => {
		const updated = [...completedChapters];
		if (!updated.includes(chapterSlug)) {
			updated.push(chapterSlug);
			setCompletedChapters(updated);
			localStorage.setItem('completedChapters', JSON.stringify(updated));
			triggerCelebration('Chapter completed!');
		}
	};

	const toggleChapterComplete = (chapterSlug) => {
		const alreadyDone = completedChapters.includes(chapterSlug);
		const updated = alreadyDone
			? completedChapters.filter(s => s !== chapterSlug)
			: [...completedChapters, chapterSlug];
		setCompletedChapters(updated);
		localStorage.setItem('completedChapters', JSON.stringify(updated));
		if (!alreadyDone) triggerCelebration('Marked complete!');
	};

	const getProgress = () => {
		if (chapters.length === 0) return 0;
		return Math.round((completedChapters.length / chapters.length) * 100);
	};

	const toggleChapter = (slug) => {
		setActiveChapter((prev) => (prev === slug ? null : slug));
		const mainDocument = document.querySelector(".system-design-content");
		if (mainDocument) mainDocument.scrollTo({ top: 0, behavior: "smooth" });
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
		// ↓ ONLY CHANGE: replaced "bg-gray-950" with exact Home color #0a0a0a
		<div className="system-design-container min-h-screen text-white" style={{ background: '#0a0a0a' }}>

			<Confetti active={showConfetti} />
			<Toast visible={toast.visible} message={toast.message} />

			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className="fixed top-[4rem] left-4 z-50 p-2 text-white rounded-lg transition-all shadow-lg lg:hidden"
				style={{ background: '#111111', border: '1.5px solid #1e1e1e' }}
			>
				{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			<div className="flex h-screen">
				{/* Sidebar — color overridden via style prop */}
				<aside
					className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 overflow-y-auto transition-transform duration-300 ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
					style={{
						background: '#0a0a0a',            /* was bg-gray-900 → #111827 */
						borderRight: '1px solid #1e1e1e', /* was rgba(80,80,100,0.3) — blue tinted */
						boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
					}}
				>
					<div className="p-4 pt-6">
						<div className="mb-6">
							<h2 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>System Design</h2>
							<div className="mt-4">
								<div className="flex items-center justify-between text-xs mb-2">
									<span style={{ color: '#999999' }}>Progress</span>
									<span style={{ color: '#ffffff', fontWeight: 700 }}>{getProgress()}%</span>
								</div>
								{/* Progress bar */}
								<div style={{ background: '#1a1a1a', borderRadius: 9999, height: 6, overflow: 'hidden' }}>
									<div
										className="rounded-full transition-all duration-500"
										style={{
											height: '100%',
											width: `${getProgress()}%`,
											background: '#444444',
										}}
									/>
								</div>
								<p className="text-xs mt-2" style={{ color: '#666666' }}>
									{completedChapters.length} of {chapters.length} chapters completed
								</p>
							</div>
						</div>

						{loading ? (
							<div className="flex justify-center items-center py-8">
								<div style={{
									width: 28, height: 28,
									border: '2px solid #1e1e1e',
									borderTopColor: '#9333ea',
									borderRadius: '50%',
									animation: 'sd-spin 0.7s linear infinite',
								}} />
								<style>{`@keyframes sd-spin { to { transform: rotate(360deg); } }`}</style>
							</div>
						) : (
							<nav className="space-y-1">
								{chapters.map((chapter, idx) => {
									const isCompleted = completedChapters.includes(chapter.slug);
									const isActive = activeChapter === chapter.slug;
									return (
										<div key={chapter.slug} className="space-y-0">
											<div className="flex items-center gap-2">
												<button
													onClick={() => {
														toggleChapter(chapter.slug);
														navigate(`/system-design/${chapter.slug}`);
													}}
													className="flex-1 flex items-center justify-between gap-3 text-left px-3 py-3 rounded-lg transition-all"
													style={{
														background: isActive ? '#1a1a1a' : 'transparent',
														border: isActive ? '1px solid #2a2a2a' : '1px solid transparent',
														color: isActive ? '#ffffff' : '#888888',
														fontSize: '15px',
														fontWeight: isActive ? 500 : 400,
													}}
													onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#0f0f0f'; e.currentTarget.style.color = '#aaaaaa'; } }}
													onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888888'; } }}
												>
													<div className="flex gap-3 items-center">
														<span style={{ fontWeight: 700, color: isActive ? '#666666' : '#444444', fontSize: '14px' }}>{idx + 1}.</span>
														<span>{chapter.title}</span>
													</div>
													{isActive
														? <ChevronUp size={18} style={{ color: '#666666' }} />
														: <ChevronDown size={18} style={{ color: '#444444' }} />
													}
												</button>

												<button
													onClick={() => toggleChapterComplete(chapter.slug)}
													className="p-2 rounded-lg transition-all flex-shrink-0"
													style={{
														background: isCompleted ? 'rgba(74,222,128,0.15)' : '#0f0f0f',
														color: isCompleted ? '#4ade80' : '#444444',
														border: `1px solid ${isCompleted ? '#15803d' : '#1a1a1a'}`,
													}}
													title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
													onMouseEnter={e => { if (!isCompleted) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666666'; } }}
													onMouseLeave={e => { if (!isCompleted) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#444444'; } }}
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
													</svg>
												</button>
											</div>

											{isActive && chapter.sections && (
												<div className="ml-8 pl-4 mt-1 mb-2 space-y-0.5" style={{ borderLeft: '2px solid #1a1a1a' }}>
													{chapter.sections.map((section) => (
														<button
															key={section.slug}
															onClick={() => scrollToSection(section.slug)}
															className="w-full text-left block rounded-md px-3 py-2.5 transition-all"
															style={{
																background: activeSubSection === section.slug ? '#1a1a1a' : 'transparent',
																color: activeSubSection === section.slug ? '#ffffff' : '#666666',
																fontSize: '14px',
																fontWeight: activeSubSection === section.slug ? 500 : 400,
															}}
															onMouseEnter={e => { if (activeSubSection !== section.slug) { e.currentTarget.style.background = '#0f0f0f'; e.currentTarget.style.color = '#aaaaaa'; } }}
															onMouseLeave={e => { if (activeSubSection !== section.slug) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666666'; } }}
														>
															{section.heading}
														</button>
													))}
												</div>
											)}
										</div>
									);
								})}
							</nav>
						)}
					</div>
				</aside>

				{/* Main content */}
				<main
					className="system-design-content flex-1 px-5 md:p-8 overflow-y-auto relative chapter-body"
					ref={containerRef}
					style={{ background: '#080808' }} /* was implicitly bg-gray-950 */
				>
					{chapterContent ? (
						<div className="w-full">
							{chapterContent.sections?.map((section) => {
								const fixedContent = section.content
									.replace(/src="images\//g, `src="${IMAGES_BASE_URL}`)
									.replace(/src='images\//g, `src='${IMAGES_BASE_URL}`)
									.replace(/src="\.\/images\//g, `src="${IMAGES_BASE_URL}`)
									.replace(/src='\.\/images\//g, `src='${IMAGES_BASE_URL}`);
								return (
									<div key={section.slug} className="w-full mb-4 relative">
										<div id={section.slug} className="chapter" dangerouslySetInnerHTML={{ __html: fixedContent }} />
										<AskAi slug={section.slug} />
									</div>
								);
							})}

							<div className="mt-8 mb-16 flex justify-center" style={{ position: 'relative', zIndex: 10 }}>
								<button
									onClick={() => markChapterComplete(activeChapter)}
									disabled={completedChapters.includes(activeChapter)}
									style={{
										position: 'relative', zIndex: 10,
										padding: '10px 24px',
										borderRadius: 8,
										fontSize: 14, fontWeight: 600,
										transition: 'all 0.15s',
										cursor: completedChapters.includes(activeChapter) ? 'default' : 'pointer',
										background: '#111111',                  /* was bg-gray-800 → #1f2937 */
										border: `1.5px solid ${completedChapters.includes(activeChapter) ? '#14532d' : '#2a2a2a'}`,
										color: completedChapters.includes(activeChapter) ? '#4ade80' : '#888888',
									}}
									onMouseEnter={e => { if (!completedChapters.includes(activeChapter)) e.currentTarget.style.borderColor = '#3a3a3a'; }}
									onMouseLeave={e => { if (!completedChapters.includes(activeChapter)) e.currentTarget.style.borderColor = '#2a2a2a'; }}
								>
									{completedChapters.includes(activeChapter) ? (
										<span className="flex items-center gap-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											Completed
										</span>
									) : (
										'Mark as Complete'
									)}
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center" style={{ color: '#444444' }}>
							<p className="text-lg">
								This Notes is from{" "}
								<i style={{ color: '#666666' }}>
									System Design Interview – An insider's guide by Alex Xu
								</i>
							</p>
							<p className="mt-4 text-sm">Select a chapter from the sidebar to start learning</p>
						</div>
					)}
				</main>
			</div>

			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 lg:hidden top-0"
					style={{ background: 'rgba(0,0,0,0.6)' }}
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
			window.open(`https://chat.openai.com/?hints=think&prompt=${encoded}`, "_blank");
		}
	};
	return (
		<button
			onClick={handleClick}
			className="flex items-center text-sm justify-center rounded-full text-white bg-neutral-800/90 px-3 py-2 transition-all duration-300 ease-in-out absolute top-5 right-5 cursor-pointer border border-neutral-700 hover:bg-neutral-700/90 shadow-md shadow-black/40"
			title="Ask ChatGPT"
		>
			<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
				<title>OpenAI</title>
				<path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"/>
			</svg>
			<span className="ml-2 hidden md:inline">Ask AI</span>
		</button>
	);
};

export default SystemDesign;