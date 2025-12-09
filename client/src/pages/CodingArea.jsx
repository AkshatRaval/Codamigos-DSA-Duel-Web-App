// Imports
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../../components/ui/resizable"
import Editor from '@monaco-editor/react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet"
import { Button } from '../../components/ui/button'
import { BsChatRightTextFill } from "react-icons/bs";
import { Input } from '../../components/ui/input'
import { DoorOpen, Link, RotateCcw, Send, Terminal, Play, Loader2, PlayCircle, Lock, ListTodo, Check } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../../components/ui/tooltip"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
// REMOVED: import { dataset } from '../data/problems'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useNavigate, useParams } from 'react-router-dom';
import { db, rtdb } from '../../firebase'
import { get, ref, remove, onValue, push, update } from 'firebase/database'
import { FaCrown, FaUser } from 'react-icons/fa'
import { useAuth } from '../lib/AuthProvider'
// ADDED: doc, getDoc to fetch specific problems
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import api from '../lib/api.js'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.jsx'
import { ButtonGroup } from '../../components/ui/button-group.jsx'

// Helper Functions
const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Main Function
const CodingArea = () => {
    const navigate = useNavigate()
    const { code } = useParams()
    const { currentUser, userData } = useAuth()

    // --- State Management ---
    const [roomData, setRoomData] = useState(null)
    const [problemsData, setProblemsData] = useState([]) // New State for fetched problems
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeProblemId, setActiveProblemId] = useState(null);
    const [testResults, setTestResults] = useState([]);

    // --- 1. Fetch Room Data & Sync ---
    useEffect(() => {
        if (!currentUser || !code) return;

        const roomRef = ref(rtdb, `rooms/${code}`);
        const messagesRef = ref(rtdb, `rooms/${code}/messages`);

        // Listener for Room Data
        const unsubscribeRoom = onValue(roomRef, (snapshot) => {
            if (!snapshot.exists()) {
                toast.error("Room ended or does not exist.");
                navigate(`/room`);
                return;
            }

            const data = snapshot.val();
            setRoomData(data);

            // Access Control
            if (data.status === "ongoing" && (!data.players || !data.players[currentUser.uid])) {
                toast.error("Match already in progress!");
                navigate('/room');
            }
        });

        // Listener for Chat Messages
        const unsubscribeChat = onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const msgs = Object.values(snapshot.val());
                setMessages(msgs);
            }
        });

        return () => {
            unsubscribeRoom();
            unsubscribeChat();
        };
    }, [code, navigate, currentUser]);

    // --- 2. NEW: Fetch Specific Problems from Firestore ---
    useEffect(() => {
        // Only run if we have roomData and haven't fetched problems yet
        if (roomData?.problems && problemsData.length === 0) {
            const fetchProblems = async () => {
                try {
                    // Create an array of promises to fetch only the 3 IDs in roomData.problems
                    const promises = roomData.problems.map(id => getDoc(doc(db, "problems", id)));

                    const snapshots = await Promise.all(promises);

                    // Map snapshots to data
                    const fetched = snapshots.map(snap => {
                        if (snap.exists()) {
                            return { id: snap.id, ...snap.data() };
                        }
                        return null;
                    }).filter(item => item !== null);

                    setProblemsData(fetched);

                    // Set active problem if not set
                    if (!activeProblemId && fetched.length > 0) {
                        setActiveProblemId(fetched[0].id);
                    }
                } catch (error) {
                    console.error("Error fetching problems:", error);
                    toast.error("Failed to load problems");
                }
            };
            fetchProblems();
        }
    }, [roomData, problemsData.length, activeProblemId]);

    // --- 3. Logic based on fetched data ---

    // Updated: Use problemsData instead of dataset
    const prob = useMemo(() => {
        if (!activeProblemId || problemsData.length === 0) return null;
        return problemsData.find((p) => p.id === activeProblemId);
    }, [activeProblemId, problemsData]);

    const testcases = useMemo(() => {
        // 1. Try to use the dedicated 'testCases' array from DB (It usually has clean JSON)
        if (prob?.testCases && prob.testCases.length > 0) {
            return prob.testCases.slice(0, 3).map(tc => ({
                input: tc.input,
                output: tc.output
            }));
        }

        // 2. Fallback to 'samples' (Display data), but CLEAN IT
        if (prob?.samples && prob.samples.length > 0) {
            return prob.samples.slice(0, 3).map(sample => {
                let cleanInput = sample.input;

                // If input looks like 's = [...]', split by '=' and take the right side
                if (cleanInput.includes('=')) {
                    cleanInput = cleanInput.split('=')[1].trim();
                }

                return {
                    input: cleanInput,
                    output: sample.output
                };
            });
        }
        return [];
    }, [prob]);

    // Reset editor when problem or language changes
    useEffect(() => {
        // Safe check for languages
        if (prob?.languages?.[selectedLanguage]?.starterCode) {
            setEditorCode(prob.languages[selectedLanguage].starterCode);
        } else if (prob?.starterCode?.[selectedLanguage]) {
            // Fallback if your DB structure is flat
            setEditorCode(prob.starterCode[selectedLanguage]);
        } else {
            setEditorCode("");
        }
    }, [selectedLanguage, prob]);


    // Chat Auto Scroll
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (roomData?.status === "ongoing" && roomData?.startTime) {
            const updateTimer = () => {
                const now = Date.now();
                const elapsedSeconds = (now - roomData.startTime) / 1000;
                const remaining = (45 * 60) - elapsedSeconds;
                setTimeLeft(remaining > 0 ? remaining : 0);
            };
            updateTimer();
            interval = setInterval(updateTimer, 1000);
        } else {
            setTimeLeft(45 * 60);
        }
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [roomData?.status, roomData?.startTime]);


    const handleEditorChange = (value) => {
        setEditorCode(value || "");
    }

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const messagesRef = ref(rtdb, `rooms/${code}/messages`);
        await push(messagesRef, {
            text: chatInput,
            sender: userData?.displayName || "Unknown",
            senderId: currentUser.uid,
            timestamp: Date.now()
        });
        setChatInput("");
    };
    // --- EXECUTION LOGIC ---

    const handleRunCode = async () => {
        // 1. Safety Checks
        if (!prob || !activeProblemId) {
            toast.error("No problem selected");
            return;
        }
        if (!editorCode.trim()) {
            toast.error("Code editor is empty");
            return;
        }

        setIsRunning(true);
        setTestResults([]);

        try {
            // 2. Get Language ID
            const lang = languages.find((lang) => lang.value === selectedLanguage);
            const lang_id = lang ? lang.languageCode : 63; // Default JS

            // 3. Prepare Submissions
            // Map the frontend 'editorCode' to 'source_code' for the backend
            const submissions = testcases.map((testCase) => ({
                language_id: lang_id,
                source_code: editorCode,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            // 4. API Call
            // Matches the backend expectation: { submissions, problemId, functionName }
            const res = await api.post('/api/judge0/run-code/batch', {
                submissions,
                functionName: prob.functionName,
                problemId: activeProblemId
            });

            // 5. Handle Response (Judge0 returns array of tokens)
            const rawData = Array.isArray(res.data) ? res.data : [res.data];
            const tokens = rawData.map(t => t.token);

            // 6. Start Polling
            await checkBatchStatus(tokens);

        } catch (error) {
            console.error("Run Code Error:", error);
            const errMsg = error.response?.data?.error || "Execution failed to start";
            toast.error(errMsg);
            setIsRunning(false);
        }
    };

    const checkBatchStatus = async (tokens) => {
        const tokenString = tokens.join(',');

        try {
            // Poll the status
            const res = await api.get(`/api/judge0/check-batch?tokens=${tokenString}`);
            const results = res.data.submissions;

            // Check if any submission is still processing (Status ID 1 or 2)
            const isPending = results.some(r => r.status.id <= 2);

            if (isPending) {
                // If pending, check again in 2 seconds
                setTimeout(() => checkBatchStatus(tokens), 2000);
            } else {
                // All done! Update UI
                setTestResults(results);
                setIsRunning(false);
                console.log(results)
                // Calculate pass rate
                const passedCount = results.filter(r => r.status.id === 3).length;
                if (passedCount === results.length) {
                    toast.success("All Test Cases Passed! 🎉");
                } else {
                    toast.error(`${results.length - passedCount} Test Cases Failed`);
                }
            }
        } catch (error) {
            console.error("Polling Error:", error);
            setIsRunning(false);
            toast.error("Error checking results");
        }
    };

    const handleSubmitCode = async () => {
        console.log("Submited")
        // Implement full submission logic here
    }

    const handleStartMatch = async () => {
        const roomRef = ref(rtdb, `rooms/${code}`);
        try {
            await update(roomRef, {
                status: "ongoing",
                startTime: Date.now()
            });
            toast.success("Match Started! Timer running.");
        } catch (error) {
            toast.error("Failed to start match");
            console.error(error);
        }
    }

    const handleLeave = async () => {
        if (!currentUser) return;
        const roomRef = ref(rtdb, `rooms/${code}`);
        const playerRef = ref(rtdb, `rooms/${code}/players/${currentUser.uid}`);
        try {
            const snapshot = await get(roomRef);
            if (!snapshot.exists()) {
                navigate(`/room`);
                return;
            }
            const currentRoomData = snapshot.val();
            const isHost = currentRoomData?.players?.[currentUser.uid]?.isHost;

            if (isHost) {
                const safeData = JSON.parse(JSON.stringify(currentRoomData));
                await addDoc(collection(db, "roomsData"), {
                    ...safeData,
                    roomId: code,
                    archivedAt: serverTimestamp()
                });
                await remove(roomRef);
                toast.success("Room archived and closed.");
            } else {
                await remove(playerRef);
                toast.success("You left the room.");
            }
            navigate(`/room`);
        } catch (error) {
            console.error("Error leaving room:", error);
            toast.error("Error processing request.");
        }
    }

    // Monaco Config
    const languages = [
        { value: 'javascript', label: 'JavaScript', languageCode: 63 },
        { value: 'python', label: 'Python', languageCode: 71 },
        { value: 'java', label: 'Java', languageCode: 62 },
        { value: 'cpp', label: 'C++', languageCode: 54 },
        { value: 'c', label: 'C', languageCode: 50 },
    ];

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    };

    const isHost = roomData?.players?.[currentUser?.uid]?.isHost;

    // Loading State
    if (!roomData || !prob) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading Room & Problems...</p>
            </div>
        )
    }

    return (
        <div className='h-screen flex flex-col bg-background'>
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">

                <ResizablePanel defaultSize={40} minSize={25} maxSize={45}>
                    <ResizablePanelGroup direction="vertical" className="w-full h-full">
                        {/* PROBLEM DESCRIPTION */}
                        <ResizablePanel defaultSize={80} minSize={60}>
                            <ScrollArea className="w-full h-full px-2 bg-accent/10">
                                <div className='p-4 flex flex-col gap-4'>
                                    <div className='flex justify-between items-start'>
                                        <div className='w-full'>
                                            <div className='flex justify-between'>
                                                <h1 className='font-bold text-2xl tracking-tight '>{prob.title}</h1>
                                                <Badge variant={prob.difficulty} className="h-fit py-2 px-5">
                                                    {prob.difficulty}
                                                </Badge>
                                            </div>
                                            <div className='flex gap-2 mt-2'>
                                                {prob.tags && prob.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="capitalize text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='text-sm text-muted-foreground text-justify leading-relaxed'>
                                        {prob.statement}
                                    </div>

                                    <Separator />

                                    <div>
                                        <h2 className='font-semibold text-lg mb-2'>Examples</h2>
                                        <div className='flex flex-col gap-4'>
                                            {prob.samples && prob.samples.map((sample, index) => (
                                                <div key={index} className='bg-muted/50 rounded-lg p-3 border text-sm'>
                                                    <div className='font-mono font-bold mb-1'>Input:</div>
                                                    <div className='bg-background p-2 rounded border mb-2 font-mono'>{sample.input}</div>
                                                    <div className='font-mono font-bold mb-1'>Output:</div>
                                                    <div className='bg-background p-2 rounded border font-mono'>{sample.output}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h2 className='font-semibold text-lg mb-2'>Constraints</h2>
                                        <ul className='list-disc list-inside text-sm text-muted-foreground'>
                                            {prob.constraints && prob.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </ScrollArea>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* PROBLEM LIST (Sidebar) */}
                        <ResizablePanel defaultSize={30} minSize={20} collapsible>
                            <ScrollArea className="h-full bg-muted/5">
                                <div className="p-4 flex flex-col gap-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <ListTodo className="h-4 w-4 text-primary" />
                                            <h3 className="font-semibold text-sm text-foreground tracking-tight">
                                                Problem List
                                            </h3>
                                        </div>
                                        <Badge variant="secondary" className="px-2 h-5 text-[10px] font-mono bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                            {problemsData.length}
                                        </Badge>
                                    </div>

                                    {/* Problem List Items */}
                                    <div className="flex flex-col gap-2.5">
                                        {problemsData.map((details, index) => {
                                            // Mapping through fetched problemsData
                                            const isActive = activeProblemId === details.id;

                                            return (
                                                <div
                                                    key={details.id}
                                                    onClick={() => setActiveProblemId(details.id)}
                                                    className={`
                                group relative flex flex-col gap-2 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer
                                hover:border-primary/50 hover:shadow-sm
                                ${isActive
                                                            ? "bg-background border-primary/60 shadow-md ring-1 ring-primary/10"
                                                            : "bg-card border-border/60 text-muted-foreground hover:bg-accent/50"
                                                        }
                            `}
                                                >
                                                    {isActive && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-lg" />
                                                    )}

                                                    <div className="flex justify-between items-start gap-3 pl-2">
                                                        <div className="flex flex-col gap-1.5 overflow-hidden">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className={`text-xs font-mono ${isActive ? 'text-primary/70' : 'text-muted-foreground/40'}`}>
                                                                    #{String(index + 1).padStart(2, '0')}
                                                                </span>
                                                                <span className={`text-sm font-semibold truncate leading-none tracking-tight ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                                                                    {details.title}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {details.tags?.[0] && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted font-medium text-muted-foreground capitalize">
                                                                        {details.tags[0]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge variant={details.difficulty}>
                                                            {details.difficulty}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            </ScrollArea>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* --- PANEL 2: EDITOR & TEST CASES --- */}
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical">

                        {/* Editor Toolbar */}
                        <div className='h-12 border-b flex items-center justify-between px-4 bg-card'>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className='flex gap-2'>
                                <ButtonGroup className="shadow-sm rounded-md isolate">
                                    <Button
                                        variant="secondary"
                                        onClick={handleRunCode}
                                        disabled={isRunning || isSubmitting}
                                        className="min-w-20"
                                    >
                                        {isRunning ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Play className="mr-2 h-4 w-4 text-gray-500" />
                                        )}
                                        Run
                                    </Button>

                                    <Button
                                        onClick={handleSubmitCode}
                                        disabled={isRunning || isSubmitting}
                                        className="min-w-20 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="mr-2 h-4 w-4" />
                                        )}
                                        Submit
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <ResizablePanel defaultSize={65}>
                            <Editor
                                height="100%"
                                language={selectedLanguage}
                                value={editorCode}
                                theme="vs-dark"
                                options={editorOptions}
                                onChange={handleEditorChange}
                            />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Test Cases Panel */}
                        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col bg-muted/10">
                            <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
                                <h1 className="font-semibold text-sm flex items-center gap-2">
                                    <Terminal size={14} /> Test Results
                                </h1>
                                <Badge variant="outline" className="text-xs">{testcases.length} Cases</Badge>
                            </div>
                            <div className="flex-1 p-4 overflow-hidden">
                                <Carousel className="w-full max-w-xl mx-auto" opts={{ align: "start" }}>
                                    <CarouselContent>
                                        {testcases.map((test, index) => (
                                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                                                <Card className='h-full'>
                                                    <CardHeader className="p-3 pb-0">
                                                        <CardTitle className="text-sm font-medium">Case {index + 1}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-3 text-xs font-mono space-y-2">
                                                        <div>
                                                            <span className="text-muted-foreground">Input:</span>
                                                            <div className="bg-muted p-1 rounded mt-1 truncate">{test.input}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Expected:</span>
                                                            <div className="bg-muted p-1 rounded mt-1 truncate">{test.output}</div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-0" />
                                    <CarouselNext className="right-0" />
                                </Carousel>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* --- PANEL 3: SIDEBAR (INFO & PLAYERS) --- */}
                <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
                    <div className="flex flex-col h-full bg-background border-l">
                        {/* Room Code & Timer */}
                        <div className='p-4 border-b flex flex-col items-center gap-3'>
                            <div className='flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-sm'>
                                {roomData?.status === "ongoing" ? <Lock size={14} /> : <Link size={14} />}
                                {code}
                            </div>
                            <div className={`text-2xl font-mono font-bold ${timeLeft < 300 && roomData?.status === "ongoing" ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                                {formatTime(timeLeft)}
                            </div>

                            {/* START MATCH BUTTON (Only for Host & if not started) */}
                            {isHost && roomData?.status !== "ongoing" && (
                                <Button
                                    onClick={handleStartMatch}
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-white text-xs"
                                >
                                    <PlayCircle className="mr-2 h-4 w-4 text-white" /> Start Match
                                </Button>
                            )}

                            {/* Status Indicator */}
                            {roomData?.status === "ongoing" && (
                                <Badge variant="secondary" className="w-full justify-center bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/50">
                                    Ongoing
                                </Badge>
                            )}
                        </div>

                        {/* Player List */}
                        <ScrollArea className='flex-1 p-3'>
                            <div className='space-y-2'>
                                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>Players</h3>
                                {roomData?.players && Object.entries(roomData.players).map(([id, player]) => (
                                    <div key={id} className='flex items-center gap-2 p-2 rounded-md bg-accent/50 border text-sm'>
                                        {player.isHost ? <FaCrown className="text-yellow-500" /> : <FaUser className="text-muted-foreground" />}
                                        <span className='truncate max-w-[100px]'>{player.name || "Unknown"}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Footer Actions */}
                        <div className='p-3 border-t grid grid-cols-2 gap-2'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-full">
                                        <RotateCcw size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset Code</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="destructive" size="icon" className="w-full" onClick={handleLeave}>
                                        <DoorOpen size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isHost ? "Archive & Close" : "Leave Room"}</TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Chat Trigger */}
                        <div className='p-3 border-t'>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className='w-full gap-2 shadow-sm' variant="secondary">
                                        <BsChatRightTextFill /> Chat Room
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="flex flex-col h-full w-full sm:w-[450px] p-0 gap-0 border-l bg-gray-50 dark:bg-zinc-900"
                                >
                                    <SheetHeader className="px-4 py-3 border-b bg-white dark:bg-zinc-950 shadow-sm z-10">
                                        <SheetTitle className="flex items-center gap-2 text-base font-bold">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <BsChatRightTextFill className="text-primary w-4 h-4" />
                                            </div>
                                            Live Chat
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                        {messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 space-y-4">
                                                <div className="p-4 bg-muted rounded-full">
                                                    <BsChatRightTextFill size={32} />
                                                </div>
                                                <p className="text-sm font-medium">No messages yet</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, i) => {
                                                const isMe = msg.senderId === currentUser.uid;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`flex w-full gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                                    >
                                                        <Avatar className="h-8 w-8 mt-1 border">
                                                            <AvatarImage src={`/avatars/${userData?.avatarurl}`} />
                                                            <AvatarFallback className="text-[10px] font-bold">
                                                                {msg.sender ? msg.sender.substring(0, 2).toUpperCase() : "U"}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                                <span className="text-[11px] font-semibold text-muted-foreground">
                                                                    {isMe ? "You" : msg.sender}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">
                                                                    10:42 AM
                                                                </span>
                                                            </div>

                                                            <div
                                                                className={`
                                                    px-3 py-2 text-sm shadow-sm wrap-break-word leading-relaxed
                                                    ${isMe
                                                                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                                                                        : 'bg-white dark:bg-zinc-800 border text-foreground rounded-2xl rounded-tl-none'
                                                                    }
                                                `}
                                                            >
                                                                {msg.text}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={scrollRef} className="pt-2" />
                                    </div>

                                    <div className="p-4 bg-white dark:bg-zinc-950 border-t">
                                        <form
                                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                            className="flex items-end gap-2"
                                        >
                                            <Input
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="Write a message..."
                                                className="flex-1 min-h-11 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
                                                autoComplete="off"
                                            />
                                            <Button
                                                type="submit"
                                                size="icon"
                                                className="h-11 w-11 rounded-full shrink-0 shadow-sm"
                                                disabled={!chatInput.trim()}
                                            >
                                                <Send size={18} className={chatInput.trim() ? "ml-0.5" : ""} />
                                            </Button>
                                        </form>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup >
        </div >
    )
}

export default CodingArea