import React, { useEffect, useState } from 'react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../../components/ui/resizable"
import Editor from '@monaco-editor/react'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet"
import { Button } from '../../components/ui/button'
import { BsChatRightTextFill } from "react-icons/bs";
import { Input } from '../../components/ui/input'
import { DoorOpen, Link, RotateCcw, Send, Terminal, Play, Loader2, PlayCircle, Lock } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../../components/ui/tooltip"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { dataset } from '../data/problems';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useNavigate, useParams } from 'react-router-dom';
import { db, rtdb } from '../../firebase'
import { get, ref, remove, onValue, push, update } from 'firebase/database' // Added 'update'
import { FaCrown, FaUser } from 'react-icons/fa'
import { useAuth } from '../lib/AuthProvider'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

// Helper to format time (MM:SS)
const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CodingArea = () => {
    const navigate = useNavigate()
    const { code } = useParams()
    const { currentUser, userData } = useAuth()
    
    // --- State Management ---
    const [roomData, setRoomData] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(45 * 60); // Default 45 mins
    const [isRunning, setIsRunning] = useState(false);
    
    // Problem Data
    const prob = dataset[0]
    const testcases = [prob.tests[0], prob.tests[1], prob.tests[2]]

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

            // Access Control: If room is ongoing and user is NOT in the player list, kick them.
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

    useEffect(() => {
        let interval;
        
        if (roomData?.status === "ongoing" && roomData?.startTime) {
            // Function to calculate remaining time based on Server Start Time
            const updateTimer = () => {
                const now = Date.now();
                const elapsedSeconds = (now - roomData.startTime) / 1000;
                const remaining = (45 * 60) - elapsedSeconds; // 45 mins duration
                
                setTimeLeft(remaining > 0 ? remaining : 0);
            };

            updateTimer(); // Initial call
            interval = setInterval(updateTimer, 1000);
        } else {
            // If not started, reset to 45 mins
            setTimeLeft(45 * 60);
        }

        return () => {
            if (interval) clearInterval(interval);
        }
    }, [roomData?.status, roomData?.startTime]);

    // --- 3. Update Code on Language Change ---
    useEffect(() => {
        if (prob?.starterCode?.[selectedLanguage]) {
            setEditorCode(prob.starterCode[selectedLanguage]);
        }
    }, [selectedLanguage]);

    // --- Handlers ---

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

    const handleRunCode = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
            toast.success("All Test Cases Passed! (Simulated)");
        }, 2000);
    };

    // --- START MATCH FUNCTION ---
    const handleStartMatch = async () => {
        const roomRef = ref(rtdb, `rooms/${code}`);
        try {
            await update(roomRef, {
                status: "ongoing",
                startTime: Date.now() // Use timestamp to sync users
            });
            toast.success("Match Started! Timer running.");
        } catch (error) {
            toast.error("Failed to start match");
            console.error(error);
        }
    }

    // --- LEAVE / ARCHIVE FUNCTION ---
    const handleLeave = async () => {
        if(!currentUser) return;

        const roomRef = ref(rtdb, `rooms/${code}`);
        const playerRef = ref(rtdb, `rooms/${code}/players/${currentUser.uid}`);

        try {
            const snapshot = await get(roomRef);
            
            // Handle case where room is already deleted
            if (!snapshot.exists()) {
                navigate(`/room`);
                return;
            }

            const currentRoomData = snapshot.val();
            const isHost = currentRoomData?.players?.[currentUser.uid]?.isHost;

            if (isHost) {
                // 1. Prepare Data: Deep copy and strip 'undefined' to prevent Firestore crash
                const safeData = JSON.parse(JSON.stringify(currentRoomData));
                
                // 2. Add to Firestore
                await addDoc(collection(db, "roomsData"), {
                    ...safeData,
                    roomId: code,
                    archivedAt: serverTimestamp()
                });

                // 3. Delete from RTDB
                await remove(roomRef);
                toast.success("Room archived and closed.");
            } else {
                // Guest: Just remove self
                await remove(playerRef);
                toast.success("You left the room.");
            }
            navigate(`/room`);
        } catch (error) {
            console.error("Error leaving room:", error);
            toast.error("Error processing request. Check console.");
        }
    }

    // Monaco Config
    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
    ];

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16 }
    };

    // Determine if current user is host
    const isHost = roomData?.players?.[currentUser?.uid]?.isHost;

    return (
        <div className='h-screen flex flex-col bg-background'>
            
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                
                {/* --- PANEL 1: PROBLEM DESCRIPTION --- */}
                <ResizablePanel defaultSize={40} minSize={25} maxSize={45}>
                    <ResizablePanelGroup direction="vertical" className="w-full h-full">
                        <ResizablePanel defaultSize={80} minSize={60}>
                            <ScrollArea className="w-full h-full px-2 bg-accent/10">
                                <div className='p-4 flex flex-col gap-4'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h1 className='font-bold text-2xl tracking-tight'>{prob.title}</h1>
                                            <div className='flex gap-2 mt-2'>
                                                <Badge variant={prob.difficulty === "Hard" ? "destructive" : prob.difficulty === "Medium" ? "default" : "secondary"}>
                                                    {prob.difficulty}
                                                </Badge>
                                                {prob.tags.map((tag) => (
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
                                            {prob.samples.map((sample, index) => (
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
                                            {prob.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </ScrollArea>
                        </ResizablePanel>
                        
                        <ResizableHandle withHandle />
                        
                        {/* Sub-Panel: Collaborative Notes Placeholder */}
                        <ResizablePanel defaultSize={20} minSize={0} collapsible>
                             <div className='p-4 text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full gap-2'>
                                <span>Collaborative Notes Coming Soon</span>
                             </div>
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
                                <Button 
                                    size="sm" 
                                    onClick={handleRunCode} 
                                    disabled={isRunning}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isRunning ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Play className="mr-2 h-4 w-4 fill-current"/>}
                                    Run Code
                                </Button>
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
                                {roomData?.status === "ongoing" ? <Lock size={14}/> : <Link size={14} />} 
                                {code}
                            </div>
                            <div className={`text-2xl font-mono font-bold ${timeLeft < 300 && roomData?.status === "ongoing" ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                                {formatTime(timeLeft)}
                            </div>
                            
                            {/* START MATCH BUTTON (Only for Host & if not started) */}
                            {isHost && roomData?.status !== "ongoing" && (
                                <Button 
                                    onClick={handleStartMatch} 
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                                >
                                    <PlayCircle className="mr-2 h-4 w-4" /> Start Match
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
                                    <Button className='w-full gap-2' variant="secondary">
                                        <BsChatRightTextFill /> Chat
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex flex-col h-full">
                                    <SheetTitle>Room Chat</SheetTitle>
                                    <Separator className="my-2"/>
                                    
                                    {/* Chat Messages Area */}
                                    <ScrollArea className="flex-1 pr-4">
                                        <div className="flex flex-col gap-3">
                                            {messages.map((msg, i) => (
                                                <div key={i} className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}>
                                                    <div className={`max-w-[85%] rounded-lg p-2 text-sm ${msg.senderId === currentUser.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground mt-1">{msg.sender}</span>
                                                </div>
                                            ))}
                                            {messages.length === 0 && <p className="text-center text-muted-foreground text-sm mt-5">No messages yet.</p>}
                                        </div>
                                    </ScrollArea>

                                    <SheetFooter className="mt-4">
                                        <div className="flex w-full gap-2">
                                            <Input 
                                                value={chatInput} 
                                                onChange={(e) => setChatInput(e.target.value)} 
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type message..." 
                                            />
                                            <Button size="icon" onClick={handleSendMessage}><Send size={16}/></Button>
                                        </div>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default CodingArea