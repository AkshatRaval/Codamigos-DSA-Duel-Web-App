import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { motion } from 'motion/react'
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from '../lib/AuthProvider'
import api from "../lib/api";
const RoomPage = () => {
  const navigate = useNavigate()
  const [isCopied, setIsCopied] = useState(false);
  const { currentUser, userData } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  // Inputs From Code
  const [inpJoinCode, setInpJoinCode] = useState('')
  const [mode, setMode] = useState('dsa')
  const [difficulty, setDifficulty] = useState('easy')
  const [inpCreateRoomName, setInpCreateRoomName] = useState('')

  console.log(currentUser)
  const handleCopy = async (code) => {
    if (isCopied) return;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCreate = async () => {
    const body = {
      roomName: inpCreateRoomName,
      mode: mode || 'dsa',
      difficulty: difficulty || 'easy',
      user: {
        uid: currentUser?.uid,
        name: userData?.displayName,
        avatarUrl: currentUser?.avatarUrl
      },
    }
    if (!inpCreateRoomName || !mode || !difficulty || !currentUser) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await api.post("/api/rooms/create-room", body)
    const data = await res.data
    setRoomCode(data?.room?.code)
    if (data.ok) {
      navigate(`/room/${data.room.code}`);
    } else {
      toast.error(data.message || "Failed to create room");
    }
  }

  const handleJoinRoom = async () => {
    const body = {
      code: inpJoinCode,
      user: {
        uid: currentUser?.uid,
        name: userData?.displayName,
        avatarUrl: currentUser?.avatarUrl
      },
    }
    const res = await api.post("/api/rooms/join-room", body)
    const data = await res.data;
    setRoomCode(data?.room?.code)
    if (data.ok) {
      navigate(`/room/${data.room.code}`);
    } else {
      toast.error(data.message || "Failed to create room");
    }
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute top-40 left-30 w-50 h-50 bg-yellow-500 rounded-full blur-[100px] opacity-20 -z-12"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-40 right-80 w-50 h-50 bg-yellow-500 rounded-full blur-[120px] opacity-20 -z-12"
      />
      <section className="grid md:grid-cols-2 ">
        <div className="relative w-full hidden md:flex h-screen">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src="/images/Connected-world-cuate.svg"
            className="scale-85 pointer-events-none -z-10"
          />

        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}

          className="w-full flex flex-col justify-center items-center h-screen">
          <Button variant="outline" className="cursor-pointer mb-3 w-2xl" onClick={() => navigate('/')}><ArrowLeft /> Back To Home </Button>
          <Tabs className="mb-5 w-full max-w-2xl" defaultValue="create">
            <TabsList className="w-full space-x-1">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card>
                <CardHeader className="font-bold text-2xl">
                  Create Your Battlefield
                  <p className="text-sm font-normal text-muted-foreground">
                    Set up your own coding arena and invite your rival to duel
                    in real-time.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label>Room Name</Label>
                      <Input id="roomname" placeholder="Enter Room Name" onChange={(e) => setInpCreateRoomName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Select Mode</Label>
                      <Select
                        onValueChange={(value) => {
                          setMode(value);
                          console.log("Selected value:", value); // Check console to see it working
                        }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dsa">DSA</SelectItem>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="open_challenge">
                            Open Challenge
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty Level</Label>
                      <RadioGroup
                        defaultValue="easy"
                        className="flex w-full items-center gap-5 mt-3"
                        onValueChange={(value) => {
                          setDifficulty(value);
                          console.log("Selected value:", value); // Check console to see it working
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="easy" id="easy" />
                          <Label htmlFor="easy">Easy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hard" id="hard" />
                          <Label htmlFor="hard">Hard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mixed" id="mixed" />
                          <Label htmlFor="mixed">Mixed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 mt-5">
                  <Button type="submit" className="w-full cursor-pointer " onClick={handleCreate}>
                    Create Room
                  </Button>
                  {roomCode != '' && (
                    <div className="w-full relative">
                      {!isCopied ?
                        <Copy className="absolute right-2 translate-[-50%] top-[50%]" size={18} />
                        : <Check className="absolute right-2 translate-[-50%] top-[50%]" size={18} />
                      }
                      <Button variant="outline" className="w-full" onClick={() => handleCopy(roomCode)}>
                        {roomCode}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="join">
              <Card>
                <CardHeader className="font-bold text-2xl">
                  Join Your Rival's Room
                  <p className="text-sm font-normal text-muted-foreground">
                    Enter the code your friend shared and prepare for a coding showdown.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label>Room Code</Label>
                      <Input id="roomcode" placeholder="Enter Room Code" onChange={(e) => setInpJoinCode(e.target.value.toUpperCase())} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 mt-5">
                  <Button type="submit" className="w-full cursor-pointer " onClick={handleJoinRoom}>
                    Join Room
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    </div>
  );
};

export default RoomPage;
