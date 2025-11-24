import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import AvatarSelector from "../components/AvatarSelector";
import { useSelector } from "react-redux";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../lib/AuthProvider";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { doc, serverTimestamp, setDoc, runTransaction, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const OnBoarding = () => {
  const avatars = [
    "/avatars/avatar0.png",
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
    "/avatars/avatar5.png",
    "/avatars/avatar6.png",
    "/avatars/avatar7.png",
    "/avatars/avatar8.png",
    "/avatars/avatar9.png",
    "/avatars/avatar10.png",
  ];

  const index = useSelector((state) => state.avatarIndex.value);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [bio, setBio] = useState("");
  const { currentUser } = useAuth();

  const normalizeHandle = (h) =>
    h.trim().replace(/^@+/, "").toLowerCase(); // remove @ and lowercase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in");
      return;
    }

    if (!displayName.trim() || !userHandle.trim() || !bio.trim()) {
      toast.error("Fill all fields");
      return;
    }

    const rawHandle = userHandle.trim();
    const handleLower = normalizeHandle(rawHandle);

    if (!handleLower || handleLower.length < 3) {
      toast.error("Handle must be at least 3 characters");
      return;
    }

    const avatarPath = avatars[index];
    const avatarFile =
      avatarPath.split("/")[avatarPath.split("/").length - 1];

    try {
      // handles/{handleLower} – used to guarantee uniqueness
      const handleRef = doc(db, "handles", handleLower);
      const userRef = doc(db, "users", currentUser.uid);

      await runTransaction(db, async (tx) => {
        const handleSnap = await tx.get(handleRef);
        if (handleSnap.exists()) {
          throw new Error("This handle is already taken");
        }

        // reserve handle
        tx.set(handleRef, {
          uid: currentUser.uid,
          createdAt: serverTimestamp(),
        });

        // create/update user doc
        tx.set(userRef, {
          uid: currentUser.uid,
          displayName: displayName.trim(),
          userHandle: rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`,
          handleLower,
          avatarUrl: avatarFile,
          bio: bio.trim(),
          friends: [],
          incomingFriendReq: [],
          outgoingFriendReq: [],
          createdAt: serverTimestamp(),
          elo: 400,
          wins: 0,
          losses: 0,
        });
      });

      toast.success("Profile saved!");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message === "This handle is already taken") {
        toast.error("That handle is already taken. Try another one.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser) return;
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        navigate("/");
      }
    };
    checkProfile();
  }, [currentUser, navigate]);


  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute bottom-50 left-20 w-72 h-72 bg-yellow-500 rounded-full blur-[120px] -z-1 opacity-20"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute top-10 right-20 w-80 h-50 bg-yellow-400 rounded-full blur-[150px] -z-1 opacity-20"
      />
      <Card className="w-full max-w-2xl ">
        <CardHeader>
          <CardTitle>Welcome to DSA Dual!</CardTitle>
          <CardDescription>
            Let's set up your profile so others can recognize you in duels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h1 className="mt-3 font-bold text-center">Select Your Avatar</h1>
            <AvatarSelector avatars={avatars} />
          </div>
          <Separator className="mb-5" />
          <div className="space-y-8">
            <div className="space-y-2">
              <Label>Enter Your Display Name</Label>
              <Input placeholder="Enter Your Epic Name" onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Enter Your Epic Handle</Label>
              <Input placeholder="Enter Your Epic Handle" onChange={(e) => setUserHandle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Enter About Yourself</Label>
              <Textarea placeholder="Enter About Yourself" onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button className="w-full" onClick={handleSubmit}>
            Save Details
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default OnBoarding;
